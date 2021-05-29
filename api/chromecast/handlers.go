package chromecast

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/eventbus"
)

type ChromecastHandler struct {
	eventbus    eventbus.EventBus
	chromecasts map[string]bool
}

func NewChromecastHandler(eb eventbus.EventBus) (ChromecastHandler, error) {
	// Start listening to events
	listener := NewEventListener(eb)
	err := listener.StartListening()
	if err != nil {
		return ChromecastHandler{}, err
	}

	return ChromecastHandler{eventbus: eb, chromecasts: listener.Chromecasts}, nil
}

func (handler ChromecastHandler) GetChromecasts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		return
	}

	if len(handler.chromecasts) == 0 {
		http.NotFound(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(handler.chromecasts); err != nil {
		log.Printf("Failed to send json back to client, %v", err)
	}
}
