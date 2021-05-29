package chromecast

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/bal3000/BalStreamer2/api/eventbus"
	"github.com/bal3000/BalStreamer2/api/models"
	"github.com/streadway/amqp"
)

const routingKey string = "chromecast-key"

var (
	latestEventType = "ChromecastLatestEvent"
	foundEventType  = "ChromecastFoundEvent"
	lostEventType   = "ChromecastLostEvent"
	handledMsgs     = make(chan models.ChromecastEvent)
)

type EventListener struct {
	Chromecasts map[string]bool
	eventbus    eventbus.EventBus
}

func NewEventListener(bus eventbus.EventBus) *EventListener {
	return &EventListener{eventbus: bus}
}

func (el *EventListener) StartListening() error {
	// cancelCtx, cancel := context.WithCancel(ctx)
	// defer cancel()

	err := el.eventbus.StartConsumer("chromecast-key", processMsgs, 2)
	if err != nil {
		return fmt.Errorf("error consuming rabbit messages: %w", err)
	}

	// send all chromecasts from last refresh to page
	go el.eventbus.SendMessage(routingKey, &models.GetLatestChromecastEvent{MessageType: latestEventType})

	// // close handle when context cancelled
	// go func() {
	// 	<-cancelCtx.Done()
	// 	log.Println("timeout reached closing channel")
	// 	close(handledMsgs)
	// }()

	// wait 5 mins max between chromocast finds
	timer := time.NewTimer(5 * time.Minute)
	go func() {
		<-timer.C
		log.Println("timeout reached closing channel")
		close(handledMsgs)
	}()

	for msg := range handledMsgs {
		switch msg.MessageType {
		case latestEventType:
			continue
		case foundEventType:
			timer.Reset(5 * time.Minute)
			el.Chromecasts[msg.Chromecast] = true
		case lostEventType:
			timer.Reset(5 * time.Minute)
			el.Chromecasts[msg.Chromecast] = false
		}
	}

	return nil
}

func processMsgs(d amqp.Delivery) bool {
	fmt.Printf("processing message: %s, with type: %s", string(d.Body), d.Type)
	event := new(models.ChromecastEvent)

	// convert mass transit message
	err := json.Unmarshal(d.Body, event)
	if err != nil {
		log.Println(err)
		return false
	}

	handledMsgs <- *event

	return true
}
