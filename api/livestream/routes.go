package livestream

import (
	"net/http"

	"github.com/gorilla/mux"
)

func (h LiveStreamHandler) Routes(r *mux.Router) {
	s := r.PathPrefix("/api/livestreams").Subrouter()
	s.HandleFunc("/{sportType}/{fromDate}/{toDate}", h.GetFixtures).Methods(http.MethodGet, http.MethodOptions)
	s.HandleFunc("/{timerId}", h.GetStreams).Methods(http.MethodGet, http.MethodOptions)
}
