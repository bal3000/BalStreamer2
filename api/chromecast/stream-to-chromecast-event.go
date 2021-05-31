package chromecast

import (
	"encoding/json"
	"time"
)

// StreamToChromecastEvent the send to chromecast event
type StreamToChromecastEvent struct {
	ChromeCastToStream string    `json:"chromeCastToStream"`
	Stream             string    `json:"stream"`
	StreamDate         time.Time `json:"streamDate"`
}

// TransformMessage transforms the message to a masstransit one and then turns into JSON
func (message *StreamToChromecastEvent) TransformMessage() ([]byte, string, error) {
	data, err := json.Marshal(message)
	if err != nil {
		return nil, "", err
	}
	return data, "StreamToChromecastEvent", nil
}
