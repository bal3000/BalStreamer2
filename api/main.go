package main

import (
	"fmt"
	"os"

	"github.com/bal3000/BalStreamer2/api/app"
	"github.com/bal3000/BalStreamer2/api/eventbus"
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
	//setup rabbit
	rabbit, closer, err := eventbus.NewRabbitMQConnection(config)
	if err != nil {
		return err
	}
	defer closer()

	// set up g mux router
	r := mux.NewRouter()

	server := app.NewServer(rabbit, r, config)
	return server.Run()
}
