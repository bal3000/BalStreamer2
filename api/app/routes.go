package app

import (
	"net/http"

	"github.com/bal3000/BalStreamer2/api/chromecast"
	"github.com/bal3000/BalStreamer2/api/handlers"
	"github.com/bal3000/BalStreamer2/api/livestream"
	"github.com/gorilla/mux"
)

// SetRoutes creates the handlers and routes for those handlers
func (s Server) SetRoutes() {
	// Handlers
	cast := handlers.NewCastHandler(s.EventBus)
	chrome := chromecast.NewChromecastHandler(s.EventBus)
	live := livestream.NewLiveStreamHandler(s.Config.LiveStreamURL, s.Config.APIKey)

	CastRoutes(s.Router, cast)
	ChromecastRoutes(s.Router, chrome)
	live.Routes(s.Router)

	s.Router.PathPrefix("/").Handler(http.FileServer(http.Dir("public/")))
}

// CastRoutes sets up the routes for the cast handler
func CastRoutes(r *mux.Router, cast handlers.CastHandler) {
	s := r.PathPrefix("/api/cast").Subrouter()
	s.HandleFunc("", cast.CastStream).Methods(http.MethodPost, http.MethodOptions)
	s.HandleFunc("", cast.StopStream).Methods(http.MethodDelete, http.MethodOptions)
}

// ChromecastRoutes sets up the routes for the chromecast handler
func ChromecastRoutes(r *mux.Router, chrome chromecast.ChromecastHandler) {
	r.HandleFunc("/chromecasts", chrome.GetChromecasts).Methods(http.MethodGet)
}

// LiveStreamRoutes sets up the routes for the live streams handler
func LiveStreamRoutes(r *mux.Router, live handlers.LiveStreamHandler) {
	s := r.PathPrefix("/api/livestreams").Subrouter()
	s.HandleFunc("/{sportType}/{fromDate}/{toDate}", live.GetFixtures).Methods(http.MethodGet, http.MethodOptions)
	s.HandleFunc("/{timerId}", live.GetStreams).Methods(http.MethodGet, http.MethodOptions)
}
