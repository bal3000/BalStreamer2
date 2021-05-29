package chromecast

import (
	"net/http"

	"github.com/gorilla/mux"
)

func (h ChromecastHandler) Routes(r *mux.Router) {
	r.HandleFunc("/api/chromecasts", h.GetChromecasts).Methods(http.MethodGet)
}
