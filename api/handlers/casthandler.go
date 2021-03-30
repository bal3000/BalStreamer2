package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/models"
)

const routingKey string = "chromecast-key"

// CastHandler - controller for casting to chromecast
type CastHandler struct {
	ExchangeName string
}

// NewCastHandler - constructor to return new controller while passing in dependencies
func NewCastHandler(en string) *CastHandler {
	return &CastHandler{ExchangeName: en}
}

// CastStream - streams given data to given chromecast
func (handler *CastHandler) CastStream(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Access-Control-Allow-Origin", "*")
	res.Header().Set("content-type", "application/json")
	castCommand := new(models.StreamToCast)

	if err := json.NewDecoder(req.Body).Decode(castCommand); err != nil {
		log.Println(err)
	}

	// Send to chromecast
	// cast := &models.StreamToChromecastEvent{
	// 	ChromeCastToStream: castCommand.Chromecast,
	// 	Stream:             castCommand.StreamURL,
	// 	StreamDate:         time.Now(),
	// }

	// send to caster here via grpc

	res.WriteHeader(http.StatusNoContent)
}

// StopStream endpoint sends the command to stop the stream on the given chromecast
func (handler *CastHandler) StopStream(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Access-Control-Allow-Origin", "*")
	res.Header().Set("content-type", "application/json")
	stopStreamCommand := new(models.StopPlayingStream)

	if err := json.NewDecoder(req.Body).Decode(stopStreamCommand); err != nil {
		log.Println(err)
	}

	// Send to chromecast
	// cast := &models.StopPlayingStreamEvent{
	// 	ChromeCastToStop: stopStreamCommand.ChromeCastToStop,
	// 	StopDateTime:     stopStreamCommand.StopDateTime,
	// }

	// send to caster here via grpc

	res.WriteHeader(http.StatusAccepted)
}
