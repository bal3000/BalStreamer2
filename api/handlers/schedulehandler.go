package handlers

import (
	"net/http"

	"github.com/bal3000/BalStreamer2/api/infrastructure"
)

// ScheduleHandler is the handler struct for schedule endpoints
type ScheduleHandler struct {
	rabbitMQ infrastructure.RabbitMQ
}

// NewScheduleHandler creates a new pointer to schedule
func NewScheduleHandler(rabbitMQ infrastructure.RabbitMQ) ScheduleHandler {
	return ScheduleHandler{rabbitMQ}
}

// AddEventToSchedule sends the event to the schedule app and logs a copy
func (handler ScheduleHandler) AddEventToSchedule(res http.ResponseWriter, req *http.Request) {
	// Get info from post object and create a rabbit message

	// Send message to rabbit and also save to db if needed

	// Return success
}
