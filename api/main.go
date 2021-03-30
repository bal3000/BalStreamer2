package main

import (
	"fmt"
	"log"
	"os"

	"github.com/bal3000/BalStreamer2/api/app"
	"github.com/bal3000/BalStreamer2/api/infrastructure"
	"github.com/gorilla/mux"
)

var config infrastructure.Configuration

func init() {
	config = infrastructure.ReadConfig()
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "startup error: %s\n", err)
		os.Exit(1)
	}
}

func run() error {
	// set up g mux router
	r := mux.NewRouter()

	// setup grpc client
	caster, err := infrastructure.NewCasterConnection(config.CasterURL)
	if err != nil {
		log.Fatalf("failed to connect to caster: %v", err)
	}

	server := app.NewServer(r, caster, config)
	return server.Run()
}
