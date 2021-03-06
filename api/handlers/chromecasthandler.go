package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/infrastructure"
	"github.com/bal3000/BalStreamer2/api/models"
	"github.com/gorilla/websocket"
	"github.com/streadway/amqp"
)

var (
	upgrader        = websocket.Upgrader{}
	latestEventType = "ChromecastLatestEvent"
	handledMsgs     = make(chan models.ChromecastEvent)
)

// ChromecastHandler the controller for the websockets
type ChromecastHandler struct {
	rabbitMQ infrastructure.RabbitMQ
}

// NewChromecastHandler creates a new ref to chromecast controller
func NewChromecastHandler(rabbit infrastructure.RabbitMQ) ChromecastHandler {
	return ChromecastHandler{rabbitMQ: rabbit}
}

// ChromecastUpdates broadcasts a chromecast to all clients once found
func (handler ChromecastHandler) ChromecastUpdates(res http.ResponseWriter, req *http.Request) {
	log.Println("Entered ws, sending current found chromecasts")

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(res, req, nil)
	if err != nil {
		log.Print("Error during connection:", err)
		return
	}
	defer ws.Close()

	err = handler.rabbitMQ.StartConsumer("chromecast-key", processMsgs, 2)
	if err != nil {
		log.Print("Error consuming rabbit messages:", err)
		return
	}

	// send all chromecasts from last refresh to page
	go handler.rabbitMQ.SendMessage(routingKey, &models.GetLatestChromecastEvent{MessageType: latestEventType})

	for msg := range handledMsgs {
		if msg.MessageType != latestEventType {
			err = ws.WriteJSON(msg)
			if err != nil {
				log.Println(err)
			}
		}
	}
	close(handledMsgs)
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
