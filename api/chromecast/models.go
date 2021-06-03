package chromecast

import "time"

// StreamToCast - the model for the json posted to the cast controller
type StreamToCast struct {
	Chromecast string `json:"chromecast"`
	StreamURL  string `json:"streamURL"`
	Fixture    string `json:"fixture"`
}

// StopPlayingStream is the model for the json posted to the stop casting endpoint
type StopPlayingStream struct {
	ChromeCastToStop string    `json:"chromeCastToStop"`
	StopDateTime     time.Time `json:"stopDateTime"`
}

// ChromecastEvent event when a chromecast is found
type ChromecastEvent struct {
	Chromecast  string `json:"chromecast"`
	MessageType string `json:"messageType"`
}

// db model for current playing event
type CurrentlyPlaying struct {
	Fixture    string `json:"fixture" bson:"fixture,omitempty"`
	Chromecast string `json:"chromecast" bson:"chromecast,omitempty"`
}