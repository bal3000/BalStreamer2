package chromecast

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/bal3000/BalStreamer2/api/eventbus"
	"github.com/streadway/amqp"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

const castJSON = `{
		"chromecast": "Family room TV",
		"streamURL": "rtmp://cdn.vops.gcp.xeatre.cloud:5222/liveedge-lowlatency-origin-wza-07/src-4506?wUzz3Tsnestarttime=1609777218&wUzz3Tsneendtime=1609781100&wUzz3Tsnehash=PN0KNFTOB-fyV9qdN2wFj5fZ0r74DtGfSdcJNwsh5Oc="
	}`

type RabbitChannelMock struct {
	mock.Mock
}

func (m *RabbitChannelMock) SendMessage(routingKey string, message eventbus.EventMessage) error {
	args := m.Called(routingKey, message)
	return args.Error(0)
}

func (m *RabbitChannelMock) StartConsumer(routingKey string, handler func(d amqp.Delivery) bool, concurrency int) error {
	args := m.Called(routingKey, handler, concurrency)
	return args.Error(0)
}

func TestCastStream(t *testing.T) {
	// Setup
	rabbitMock := new(RabbitChannelMock)

	cast := &StreamToChromecastEvent{
		Chromecast: "Family room TV",
		StreamURL:  "rtmp://cdn.vops.gcp.xeatre.cloud:5222/liveedge-lowlatency-origin-wza-07/src-4506?wUzz3Tsnestarttime=1609777218&wUzz3Tsneendtime=1609781100&wUzz3Tsnehash=PN0KNFTOB-fyV9qdN2wFj5fZ0r74DtGfSdcJNwsh5Oc=",
	}
	rabbitMock.On("SendMessage", "chromecast-key", cast).Return(nil)
	// rabbitMock.On("StartConsumer", "chromecast-key", mock.AnythingOfType("func(amqp.Delivery) bool"), 2).Return(nil)

	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(castJSON))
	rec := httptest.NewRecorder()
	castHandle := ChromecastHandler{eventbus: rabbitMock}
	castHandle.CastStream(rec, req)
	// Assertions
	assert.Equal(t, http.StatusNoContent, rec.Code)
	assert.Equal(t, "", rec.Body.String())
	rabbitMock.AssertExpectations(t)
}
