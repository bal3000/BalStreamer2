package chromecast

import (
	"encoding/json"
)

// StreamToChromecastEvent the send to chromecast event
type StreamToChromecastEvent struct {
	Chromecast string `json:"chromecast"`
	StreamURL  string `json:"streamURL"`
}

// TransformMessage transforms the message to a masstransit one and then turns into JSON
func (message *StreamToChromecastEvent) TransformMessage() ([]byte, string, error) {
	data, err := json.Marshal(message)
	if err != nil {
		return nil, "", err
	}
	return data, "PlayStreamEvent", nil
}
