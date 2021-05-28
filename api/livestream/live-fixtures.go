package livestream

type LiveFixtures struct {
	StateName            string `json:"stateName"`
	UtcStart             string `json:"utcStart"`
	UtcEnd               string `json:"utcEnd"`
	Title                string `json:"title"`
	EventID              string `json:"eventId"`
	ContentTypeName      string `json:"contentTypeName"`
	TimerID              string `json:"timerId"`
	IsPrimary            string `json:"isPrimary"`
	BroadcastChannelName string `json:"broadcastChannelName"`
	BroadcastNationName  string `json:"broadcastNationName"`
	SourceTypeName       string `json:"sourceTypeName"`
}
