package chromecast

// ChromecastEvent event when a chromecast is found
type ChromecastEvent struct {
	Chromecast  string `json:"chromecast"`
	MessageType string `json:"messageType"`
}
