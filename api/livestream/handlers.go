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

func (handler LiveStreamHandler) GetFixtures(w http.ResponseWriter, r *http.Request) {
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
	fixtures := &[]LiveFixtures{}
	err := callApi(ctx, url, handler.apiKey, fixtures)
	if err != nil {
		log.Println(err)
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

func (handler LiveStreamHandler) GetLiveFixtures(w http.ResponseWriter, r *http.Request) {
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
	fixtures := &[]LiveFixtures{}

	err := callApi(ctx, url, handler.apiKey, fixtures)
	if err != nil {
		log.Println(err)
	}

	var liveFixtures = []LiveFixtures{}
	for _, fixture := range *fixtures {
		start := parseDate(fixture.UtcStart)
		end := parseDate(fixture.UtcEnd)

		if time.Now().After(start) && time.Now().Before(end) {
			liveFixtures = append(liveFixtures, fixture)
		}
	}

	if len(liveFixtures) == 0 {
		http.NotFound(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(liveFixtures); err != nil {
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
	streams := &Streams{}
	err := callApi(ctx, url, handler.apiKey, streams)
	if err != nil {
		log.Println(err)
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(*streams); err != nil {
		log.Printf("Failed to send json back to client, %v", err)
	}
}

func parseDate(date string) time.Time {
	layout := "2006-01-02T15:04:05"
	t, err := time.Parse(layout, date)
	if err != nil {
		log.Printf("failed to convert time from live streams, %v", err)
	}

	return t
}

func callApi(ctx context.Context, url string, apiKey string, body interface{}) error {
	client := &http.Client{}
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request to url, %s, err: %w", url, err)
	}
	request.Header.Add("APIKey", apiKey)

	response, err := client.Do(request)
	if err != nil {
		return fmt.Errorf("failed to get fixtures from url, %s, err: %w", url, err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK && response.StatusCode != http.StatusNotFound {
		return fmt.Errorf("url, %s, returned a status code of: %v", url, response.StatusCode)
	}

	if err := json.NewDecoder(response.Body).Decode(body); err != nil {
		return fmt.Errorf("failed to convert JSON, err: %w", err)
	}

	return nil
}
