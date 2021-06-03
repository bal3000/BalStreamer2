package app

import (
	"net/http"

	"github.com/bal3000/BalStreamer2/api/chromecast"
	"github.com/bal3000/BalStreamer2/api/livestream"
)

// SetRoutes creates the handlers and routes for those handlers
func (s Server) SetRoutes() {
	// Handlers
	chrome := chromecast.NewChromecastHandler(s.EventBus, s.ChromecastDatastore)
	chrome.Routes(s.Router)

	live := livestream.NewLiveStreamHandler(s.Config.LiveStreamURL, s.Config.APIKey)
	live.Routes(s.Router)

	s.Router.PathPrefix("/").Handler(http.FileServer(http.Dir("public/")))
}
