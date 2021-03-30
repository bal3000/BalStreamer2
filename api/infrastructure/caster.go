package infrastructure

import (
	"context"
	"log"
	"time"

	caster "github.com/bal3000/BalStreamer2/api/caster"
	"google.golang.org/grpc"
)

type Caster interface {
	CastStreamToChromecast(chromecast string, streamURL string) (*caster.CastStartResponse, error)
	StopStream(chromecast string) error
}

type casterConnection struct {
	castingClient    caster.CastingClient
	chromecastClient caster.ChromecastClient
}

func NewCasterConnection(casterUrl string) (Caster, error) {
	var opts []grpc.DialOption
	opts = append(opts, grpc.WithInsecure())
	opts = append(opts, grpc.WithBlock())

	conn, err := grpc.Dial(casterUrl, opts...)
	if err != nil {
		log.Fatalf("failed to dial: %v", err)
		return nil, err
	}
	defer conn.Close()

	castingClient := caster.NewCastingClient(conn)
	chromecastClient := caster.NewChromecastClient(conn)

	return &casterConnection{castingClient, chromecastClient}, nil
}

func (c *casterConnection) CastStreamToChromecast(chromecast string, streamURL string) (*caster.CastStartResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return c.castingClient.CastStream(ctx, &caster.CastStartRequest{Chromecast: chromecast, Stream: streamURL})
}

func (c *casterConnection) StopStream(chromecast string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_, err := c.castingClient.StopStream(ctx, &caster.StopStreamRequest{Chromecast: chromecast})
	return err
}
