package chromecast

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/eventbus"
	"github.com/streadway/amqp"
)

const routingKey string = "chromecast-key"

var (
	latestEventType = "ChromecastLatestEvent"
	handledMsgs     = make(chan ChromecastEvent)
)

type ChromecastHandler struct {
	eventbus eventbus.EventBus
}

func NewChromecastHandler(eb eventbus.EventBus) ChromecastHandler {
	return ChromecastHandler{eventbus: eb}
}

func (handler ChromecastHandler) GetChromecasts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		return
	}

	err := handler.eventbus.StartConsumer("chromecast-key", processMsgs, 2)
	if err != nil {
		log.Print("Error consuming rabbit messages:", err)
		return
	}

	// send all chromecasts from last refresh to page
	go handler.eventbus.SendMessage(routingKey, &GetLatestChromecastEvent{MessageType: latestEventType})

	var chromecasts = []ChromecastEvent{}

	for msg := range handledMsgs {
		if msg.MessageType != latestEventType {
			chromecasts = append(chromecasts, msg)
		}
	}
	close(handledMsgs)
}

func processMsgs(d amqp.Delivery) bool {
	fmt.Printf("processing message: %s, with type: %s", string(d.Body), d.Type)
	event := new(ChromecastEvent)

	// convert mass transit message
	err := json.Unmarshal(d.Body, event)
	if err != nil {
		log.Println(err)
		return false
	}

	handledMsgs <- *event

	return true
}
