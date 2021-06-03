package chromecast

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/eventbus"
)

type ChromecastHandler struct {
	eventbus    eventbus.EventBus
	datastore   DataStore
	chromecasts map[string]bool
}

func NewChromecastHandler(eb eventbus.EventBus, ds DataStore) ChromecastHandler {
	// Start listening to events
	listener := NewEventListener(eb)
	go func() {
		err := listener.StartListening()
		if err != nil {
			log.Fatalf("error listening to events: %v", err)
		}
	}()

	return ChromecastHandler{eventbus: eb, datastore: ds, chromecasts: listener.Chromecasts}
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

	casts := make([]string, len(handler.chromecasts)-1)
	for k := range handler.chromecasts {
		casts = append(casts, k)
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(casts); err != nil {
		log.Printf("Failed to send json back to client, %v", err)
	}
}

// CastStream - streams given data to given chromecast
func (handler ChromecastHandler) CastStream(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("content-type", "application/json")
	res.Header().Set("Access-Control-Allow-Origin", "*")
	res.Header().Set("Access-Control-Allow-Methods", "DELETE,HEAD,OPTIONS,POST,PUT")
	res.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")

	if req.Method == http.MethodOptions {
		return
	}

	castCommand := new(StreamToCast)

	if err := json.NewDecoder(req.Body).Decode(castCommand); err != nil {
		log.Println(err)
	}

	// Send to chromecast
	cast := &StreamToChromecastEvent{
		Chromecast: castCommand.Chromecast,
		StreamURL:  castCommand.StreamURL,
	}

	if err := handler.eventbus.SendMessage(routingKey, cast); err != nil {
		log.Fatalln(err)
	}

	// save to db
	err := handler.datastore.SaveCurrentlyPlaying(req.Context(), CurrentlyPlaying{
		Fixture:    castCommand.Fixture,
		Chromecast: castCommand.Chromecast,
	})
	if err != nil {
		log.Println(err)
		http.Error(res, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res.WriteHeader(http.StatusNoContent)
}

// StopStream endpoint sends the command to stop the stream on the given chromecast
func (handler ChromecastHandler) StopStream(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("content-type", "application/json")
	res.Header().Set("Access-Control-Allow-Origin", "*")
	res.Header().Set("Access-Control-Allow-Methods", "DELETE,HEAD,OPTIONS,POST,PUT")
	res.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")

	log.Println("method", req.Method)
	if req.Method == http.MethodOptions {
		return
	}

	stopStreamCommand := new(StopPlayingStream)

	if err := json.NewDecoder(req.Body).Decode(stopStreamCommand); err != nil {
		log.Println(err)
	}

	// Send to chromecast
	cast := &StopPlayingStreamEvent{
		ChromeCastToStop: stopStreamCommand.ChromeCastToStop,
		StopDateTime:     stopStreamCommand.StopDateTime,
	}

	if err := handler.eventbus.SendMessage(routingKey, cast); err != nil {
		log.Fatalln(err)
	}

	// delete from db
	err := handler.datastore.DeleteCurrentPlaying(req.Context(), stopStreamCommand.ChromeCastToStop)
	if err != nil {
		log.Println(err)
		http.Error(res, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res.WriteHeader(http.StatusAccepted)
}

func (handler ChromecastHandler) GetCurrentlyPlayingStream(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		return
	}

	playing, err := handler.datastore.GetCurrentlyPlaying(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if len(playing) == 0 {
		http.NotFound(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(playing); err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}
