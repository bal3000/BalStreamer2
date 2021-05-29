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
	chrome.Routes(s.Router)

	live := livestream.NewLiveStreamHandler(s.Config.LiveStreamURL, s.Config.APIKey)
	live.Routes(s.Router)

	CastRoutes(s.Router, cast)

	s.Router.PathPrefix("/").Handler(http.FileServer(http.Dir("public/")))
}

// CastRoutes sets up the routes for the cast handler
func CastRoutes(r *mux.Router, cast handlers.CastHandler) {
	s := r.PathPrefix("/api/cast").Subrouter()
	s.HandleFunc("", cast.CastStream).Methods(http.MethodPost, http.MethodOptions)
	s.HandleFunc("", cast.StopStream).Methods(http.MethodDelete, http.MethodOptions)
}
