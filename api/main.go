package main

import (
	"fmt"
	"os"

	"github.com/bal3000/BalStreamer2/api/app"
	"github.com/bal3000/BalStreamer2/api/config"
	"github.com/bal3000/BalStreamer2/api/eventbus"
	"github.com/gorilla/mux"
)

var configuration config.Configuration

func init() {
	configuration = config.ReadConfig()
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "startup error: %s\n", err)
		os.Exit(1)
	}
}

func run() error {
	//setup rabbit
	rabbit, closer, err := eventbus.NewRabbitMQConnection(configuration)
	if err != nil {
		return err
	}
	defer closer()

	// set up g mux router
	r := mux.NewRouter()

	server := app.NewServer(rabbit, r, configuration)
	return server.Run()
}
