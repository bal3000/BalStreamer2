package livestream

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type LiveStreamHandler struct {
	liveStreamURL, apiKey string
}

func NewLiveStreamHandler(liveURL string, key string) LiveStreamHandler {
	return LiveStreamHandler{liveStreamURL: liveURL, apiKey: key}
}

func (h LiveStreamHandler) GetFixtures(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	vars := mux.Vars(r)
	sportType := vars["sportType"]
	fromDate := vars["fromDate"]
	toDate := vars["toDate"]

	url := fmt.Sprintf("%s/%s/%s/%s", h.liveStreamURL, sportType, fromDate, toDate)
	client := &http.Client{}
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		log.Printf("failed to create request to url %s, error: %v", url, err)
	}
	request.Header.Add("APIKey", h.apiKey)

	response, err := client.Do(request)
	if err != nil {
		log.Printf("failed to get fixtures from url %s, error: %v", url, err)
	}
	defer response.Body.Close()

	fixtures := &[]LiveFixtures{}
	err = json.NewDecoder(response.Body).Decode(fixtures)
	if err != nil {
		log.Printf("failed to convert json to fixtures: %v", err)
	}

	if len(*fixtures) == 0 {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(*fixtures); err != nil {
		log.Printf("Failed to send json back to client, %v", err)
	}
}

func (handler LiveStreamHandler) GetStreams(w http.ResponseWriter, r *http.Request) {
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

	streams := &Streams{}
	err = json.NewDecoder(response.Body).Decode(streams)
	if err != nil {
		log.Printf("Failed to convert streams json, %v", err)
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(*streams); err != nil {
		log.Printf("Failed to send json back to client, %v", err)
	}
}
