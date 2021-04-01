package handlers

import (
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/infrastructure"
	"github.com/bal3000/BalStreamer2/api/models"
	"github.com/gorilla/websocket"
)

var (
	upgrader           = websocket.Upgrader{}
	chromecasts        = make(map[string]models.ChromecastEvent)
	handledChromecasts = make(chan models.ChromecastEvent)
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

	// get from caster via grpc
	go handler.Caster.FindChromecasts(handleChromecastEvent)

	for cast := range handledChromecasts {
		log.Printf("sending chromecast %s with status %v", cast.Name, cast.Lost)
		err = ws.WriteJSON(cast)
		if err != nil {
			log.Fatalln(err)
		}
	}
	close(handledChromecasts)
}

func handleChromecastEvent(name string, lost bool) {
	log.Printf("handling chromecast %s with status %v", name, lost)
	chromecast := models.ChromecastEvent{
		Name: name,
		Lost: lost,
	}

	if chromecast.Lost {
		delete(chromecasts, chromecast.Name)
	} else {
		chromecasts[chromecast.Name] = chromecast
	}

	handledChromecasts <- chromecast
}
