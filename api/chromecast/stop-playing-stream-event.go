package chromecast

import (
	"encoding/json"
	"time"
)

// StopPlayingStreamEvent the stop cast event
type StopPlayingStreamEvent struct {
	ChromeCastToStop string    `json:"chromeCastToStop"`
	StopDateTime     time.Time `json:"stopDateTime"`
}

// TransformMessage transforms the message to a masstransit one and then turns into JSON
func (message *StopPlayingStreamEvent) TransformMessage() ([]byte, string, error) {
	data, err := json.Marshal(message)
	if err != nil {
		return nil, "", err
	}
	return data, "StopStreamEvent", nil
}
