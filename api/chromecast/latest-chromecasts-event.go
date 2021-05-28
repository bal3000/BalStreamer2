package chromecast

import "encoding/json"

type GetLatestChromecastEvent struct {
	MessageType string `json:"messageType"`
}

// TransformMessage transforms the message to a masstransit one and then turns into JSON
func (message *GetLatestChromecastEvent) TransformMessage() ([]byte, string, error) {
	data, err := json.Marshal(message)
	if err != nil {
		return nil, "", err
	}
	return data, "ChromecastLatestEvent", nil
}
