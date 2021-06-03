package chromecast

import (
	"net/http"

	"github.com/gorilla/mux"
)

func (h ChromecastHandler) Routes(r *mux.Router) {
	r.HandleFunc("/api/chromecasts", h.GetChromecasts).Methods(http.MethodGet)
	r.HandleFunc("/api/currentplaying", h.GetCurrentlyPlayingStream).Methods(http.MethodGet)

	s := r.PathPrefix("/api/cast").Subrouter()
	s.HandleFunc("", h.CastStream).Methods(http.MethodPost, http.MethodOptions)
	s.HandleFunc("", h.StopStream).Methods(http.MethodDelete, http.MethodOptions)
}
