package eventbus

import "github.com/streadway/amqp"

// TODO: revisit the dependancy on rabbit

type EventBus interface {
	SendMessage(routingKey string, message EventMessage) error
	StartConsumer(routingKey string, handler func(d amqp.Delivery) bool, concurrency int) error
}
