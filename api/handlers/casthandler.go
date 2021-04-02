package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/bal3000/BalStreamer2/api/infrastructure"
	"github.com/bal3000/BalStreamer2/api/models"
)

// CastHandler - controller for casting to chromecast
type CastHandler struct {
	Caster infrastructure.Caster
}

// NewCastHandler - constructor to return new controller while passing in dependencies
func NewCastHandler(caster infrastructure.Caster) *CastHandler {
	return &CastHandler{Caster: caster}
}

// CastStream - streams given data to given chromecast
func (handler *CastHandler) CastStream(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("content-type", "application/json")
	res.Header().Set("Access-Control-Allow-Origin", "*")

	if req.Method == http.MethodOptions {
		return
	}

	castCommand := new(models.StreamToCast)

	if err := json.NewDecoder(req.Body).Decode(castCommand); err != nil {
		log.Println(err)
	}

	// send to caster here via grpc
	response, err := handler.Caster.CastStreamToChromecast(castCommand.Chromecast, castCommand.StreamURL)
	if err != nil {
		log.Fatalf("failed to send stream to chromecast, %v", err)
	}
	log.Println("response Success")

	if response.Success {
		res.WriteHeader(http.StatusNoContent)
	} else {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("There was a problem sending the stream to chromecast %s, please try again later", castCommand.Chromecast)))
	}
}

// StopStream endpoint sends the command to stop the stream on the given chromecast
func (handler *CastHandler) StopStream(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("content-type", "application/json")
	res.Header().Set("Access-Control-Allow-Origin", "*")

	if req.Method == http.MethodOptions {
		return
	}

	stopStreamCommand := new(models.StopPlayingStream)

	if err := json.NewDecoder(req.Body).Decode(stopStreamCommand); err != nil {
		log.Println(err)
	}

	// send to caster here via grpc
	err := handler.Caster.StopStream(stopStreamCommand.ChromeCastToStop)
	if err != nil {
		log.Fatalf("failed to send stream to chromecast, %v", err)
	}

	res.WriteHeader(http.StatusAccepted)
}
