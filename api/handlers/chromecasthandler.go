package handlers

import (
	"io"
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/infrastructure"
	"github.com/bal3000/BalStreamer2/api/models"
	"github.com/gorilla/websocket"
)

var (
	upgrader    = websocket.Upgrader{}
	chromecasts = make(map[string]models.ChromecastEvent)
)

// ChromecastHandler the controller for the websockets
type ChromecastHandler struct {
	Caster infrastructure.Caster
}

// NewChromecastHandler creates a new ref to chromecast controller
func NewChromecastHandler(caster infrastructure.Caster) *ChromecastHandler {
	return &ChromecastHandler{Caster: caster}
}

// ChromecastUpdates broadcasts a chromecast to all clients once found
func (handler *ChromecastHandler) ChromecastUpdates(res http.ResponseWriter, req *http.Request) {
	log.Println("Entered ws, sending current found chromecasts")

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(res, req, nil)
	if err != nil {
		log.Fatalln(err)
	}
	defer ws.Close()

	// send all chromecasts from last refresh to page

	log.Printf("Current chromecasts, %v", len(chromecasts))
	for _, event := range chromecasts {
		log.Printf("sending chromecast, %v", event)
		err = ws.WriteJSON(event)
		if err != nil {
			log.Fatalln(err)
		}
	}

	// get from caster via grpc
	stream, err := handler.Caster.FindChromecasts()
	if err != nil {
		log.Fatalln(err)
	}

	wait := make(chan bool)

	go func() {
		for {
			event, err := stream.Recv()
			if err == io.EOF {
				// read done.
				close(wait)
				return
			}
			if err != nil {
				log.Fatalf("Failed to receive a chromecast : %v", err)
			}
			log.Printf("Got chromecast %s with status %v", event.ChromecastName, event.ChromecastStatus)

			chromecast := models.ChromecastEvent{
				Name: event.ChromecastName,
				Lost: event.ChromecastStatus == 1,
			}

			if chromecast.Lost {
				delete(chromecasts, chromecast.Name)
			} else {
				chromecasts[chromecast.Name] = chromecast
			}

			ws.WriteJSON(chromecast)
		}
	}()

	<-wait
}
