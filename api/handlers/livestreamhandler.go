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
	if err != nil {
		log.Printf("Failed to create request, %v", err)
	}

	request.Header.Add("APIKey", handler.apiKey)
	response, err := client.Do(request)
	if err != nil {
		log.Printf("Failed to get fixtures, %v", err)
	}
	defer response.Body.Close()

	fixtures := &[]models.LiveFixtures{}
	err = json.NewDecoder(response.Body).Decode(fixtures)
	if err != nil {
		log.Printf("Failed to convert fixtures json, %v", err)
	}

	// log.Printf("fixtures found: %v", *fixtures)

	if len(*fixtures) == 0 {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(*fixtures); err != nil {
		log.Printf("Failed to send json back to client, %v", err)
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
	if err != nil {
		log.Printf("Failed to create request, %v", err)
	}

	request.Header.Add("APIKey", handler.apiKey)
	response, err := client.Do(request)
	if err != nil {
		log.Printf("Failed to get streams, %v", err)
	}
	defer response.Body.Close()

	streams := &models.Streams{}
	err = json.NewDecoder(response.Body).Decode(streams)
	if err != nil {
		log.Printf("Failed to convert streams json, %v", err)
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(*streams); err != nil {
		log.Printf("Failed to send json back to client, %v", err)
	}
}
