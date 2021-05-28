package livestream

type Streams struct {
	HLS     string `json:"hls"`
	HLSDvr  string `json:"hlsDvr"`
	Dash    string `json:"dash"`
	DashDvr string `json:"dashDvr"`
	RTMP    string `json:"rtmp"`
}
