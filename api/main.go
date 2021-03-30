package main

import (
	"fmt"
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
	r := mux.NewRouter()

	server := app.NewServer(r, config)
	return server.Run()
}
