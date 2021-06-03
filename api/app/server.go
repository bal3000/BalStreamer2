package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/bal3000/BalStreamer2/api/chromecast"
	"github.com/bal3000/BalStreamer2/api/config"
	"github.com/bal3000/BalStreamer2/api/eventbus"
	"github.com/gorilla/mux"
)

type Server struct {
	EventBus            eventbus.EventBus
	ChromecastDatastore chromecast.DataStore
	Router              *mux.Router
	Config              config.Configuration
}

func NewServer(eventbus eventbus.EventBus, cdatastore chromecast.DataStore, r *mux.Router, config config.Configuration) Server {
	return Server{EventBus: eventbus, ChromecastDatastore: cdatastore, Router: r, Config: config}
}

func (s Server) Run() error {
	// Routes
	s.SetRoutes()

	s.Router.Use(mux.CORSMethodMiddleware(s.Router))
	srv := &http.Server{
		Addr: "0.0.0.0:8080",
		// Good practice to set timeouts to avoid Slowloris attacks.
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      s.Router, // Pass our instance of gorilla/mux in.
	}

	// Start server
	// Run our server in a goroutine so that it doesn't block.
	go func() {
		log.Println("Started Server on port 8080")
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	c := make(chan os.Signal, 1)
	// We'll accept graceful shutdowns when quit via SIGINT (Ctrl+C)
	// SIGKILL, SIGQUIT or SIGTERM (Ctrl+/) will not be caught.
	signal.Notify(c, os.Interrupt)

	// Block until we receive our signal.
	<-c

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()
	// Doesn't block if no connections, but will otherwise wait
	// until the timeout deadline.
	if err := srv.Shutdown(ctx); err != nil {
		return err
	}

	log.Println("shutting down")
	os.Exit(0)
	return nil
}
