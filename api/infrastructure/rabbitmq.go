package infrastructure

import (
	"errors"
	"fmt"
	"log"

	"github.com/bal3000/BalStreamer2/api/models"
	"github.com/streadway/amqp"
)

// RabbitMQ interface to inject into handlers for using rabbitmq
type RabbitMQ interface {
	SendMessage(routingKey string, message models.EventMessage) error
	StartConsumer(routingKey string, handler func(d amqp.Delivery) bool, concurrency int) error
}

// RabbitMQConnection - settings to create a connection
type rabbitMQConnection struct {
	configuration Configuration
	channel       *amqp.Channel
}

type rabbitError struct {
	ogErr   error
	message string
}

func (err rabbitError) Error() string {
	return fmt.Sprintf("%s - %s", err.message, err.ogErr)
}

// NewRabbitMQConnection creates a new rabbit mq connection
func NewRabbitMQConnection(config Configuration) (*rabbitMQConnection, func(), error) {
	conn, err := amqp.Dial(config.RabbitURL)
	if err != nil {
		return nil, nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, nil, err
	}
	return &rabbitMQConnection{configuration: config, channel: ch}, func() {
		log.Println("Closing rabbitMQ channel and connection")
		if err := ch.Close(); err != nil {
			log.Printf("Rabbit channel closed with error: %v", err)
		}
		if err := conn.Close(); err != nil {
			log.Printf("Rabbit connection closed with error: %v", err)
		}
		log.Println("Closed rabbitMQ channel and connection")
	}, nil
}

// SendMessage sends the given message
func (mq *rabbitMQConnection) SendMessage(routingKey string, message models.EventMessage) error {
	if mq == nil {
		return errors.New("rabbitMQ connection cannot be nil")
	}

	b, t, err := message.TransformMessage()
	if err != nil {
		return err
	}

	log.Println("Converted message to JSON and sending")

	return mq.channel.Publish(
		mq.configuration.ExchangeName, // exchange
		routingKey,                    // routing key
		false,                         // mandatory
		false,                         // immediate
		amqp.Publishing{
			Type:         t,
			ContentType:  "application/json",
			Body:         []byte(b),
			DeliveryMode: amqp.Persistent,
		})
}

// StartConsumer - starts consuming messages from the given queue
func (mq *rabbitMQConnection) StartConsumer(routingKey string, handler func(d amqp.Delivery) bool, concurrency int) error {
	if mq == nil {
		return errors.New("rabbitMQ connection cannot be nil")
	}

	// create the queue if it doesn't already exist
	_, err := mq.channel.QueueDeclare(mq.configuration.QueueName, true, false, false, false, nil)
	if err != nil {
		return returnErr(err, fmt.Sprintf("Failed to declare a queue: %s", mq.configuration.QueueName))
	}

	// bind the queue to the routing key
	err = mq.channel.QueueBind(mq.configuration.QueueName, routingKey, mq.configuration.ExchangeName, false, nil)
	if err != nil {
		return returnErr(err, fmt.Sprintf("Failed to bind to queue: %s", mq.configuration.QueueName))
	}

	// prefetch 4x as many messages as we can handle at once
	prefetchCount := concurrency * 4
	err = mq.channel.Qos(prefetchCount, 0, false)
	if err != nil {
		return returnErr(err, "Failed to setup prefetch")
	}

	msgs, err := mq.channel.Consume(
		mq.configuration.QueueName, // queue
		"",                         // consumer
		false,                      // auto-ack
		false,                      // exclusive
		false,                      // no-local
		false,                      // no-wait
		nil,                        // args
	)
	if err != nil {
		return returnErr(err, "Failed to get any messages")
	}

	for i := 0; i < concurrency; i++ {
		fmt.Printf("Processing messages on thread %v...\n", i)
		go func() {
			for msg := range msgs {
				// if tha handler returns true then ACK, else NACK
				// the message back into the rabbit queue for
				// another round of processing
				if handler(msg) {
					msg.Ack(false)
				} else {
					msg.Nack(false, true)
				}
			}
			log.Panicln("Rabbit consumer closed - critical Error")
		}()
	}

	return nil
}

func returnErr(err error, msg string) error {
	re := rabbitError{message: msg, ogErr: err}
	return re
}
