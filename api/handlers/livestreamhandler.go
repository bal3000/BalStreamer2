package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"github.com/bal3000/BalStreamer2/api/models"
)

// LiveStreamHandler - handler for everything to do with the live stream API
type LiveStreamHandler struct {
	liveStreamURL, apiKey string
}

// NewLiveStreamHandler - Creates a new instance of live stream handler
func NewLiveStreamHandler(liveURL string, key string) *LiveStreamHandler {
	return &LiveStreamHandler{liveStreamURL: liveURL, apiKey: key}
}

// GetFixtures - Gets the fixtures for the given sport and date range
func (handler *LiveStreamHandler) GetFixtures(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	vars := mux.Vars(r)
	sportType := vars["sportType"]
	fromDate := vars["fromDate"]
	toDate := vars["toDate"]

	url := fmt.Sprintf("%s/%s/%s/%s", handler.liveStreamURL, sportType, fromDate, toDate)
	client := &http.Client{}
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	logErrors(err)

	request.Header.Add("APIKey", handler.apiKey)
	response, err := client.Do(request)
	logErrors(err)
	defer response.Body.Close()

	fixtures := &[]models.LiveFixtures{}
	err = json.NewDecoder(response.Body).Decode(fixtures)
	logErrors(err)

	if len(*fixtures) == 0 {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(*fixtures); err != nil {
		log.Fatalln(err)
	}
}

// GetStreams gets the streams for the fixture
func (handler *LiveStreamHandler) GetStreams(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	vars := mux.Vars(r)
	timerID := vars["timerId"]

	url := fmt.Sprintf("%s/%s", handler.liveStreamURL, timerID)
	client := &http.Client{}
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	logErrors(err)

	request.Header.Add("APIKey", handler.apiKey)
	response, err := client.Do(request)
	logErrors(err)
	defer response.Body.Close()

	streams := &models.Streams{}
	err = json.NewDecoder(response.Body).Decode(streams)
	logErrors(err)

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(*streams); err != nil {
		log.Fatalln(err)
	}
}

func logErrors(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}
