package infrastructure

import (
	"context"
	"io"
	"log"
	"time"

	caster "github.com/bal3000/BalStreamer2/api/caster"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
)

type Caster interface {
	CastStreamToChromecast(chromecast string, streamURL string) (*caster.CastStartResponse, error)
	StopStream(chromecast string) error
	FindChromecasts(eventHandler func(name string, lost bool))
	CloseConnection() error
}

type casterConnection struct {
	castingClient    caster.CastingClient
	chromecastClient caster.ChromecastClient
	conn             *grpc.ClientConn
}

func NewCasterConnection(casterUrl string) (Caster, error) {
	var opts []grpc.DialOption
	opts = append(opts, grpc.WithInsecure())

	log.Printf("Connecting to caster at %s", casterUrl)
	conn, err := grpc.Dial(":5000", opts...)
	if err != nil {
		log.Fatalf("failed to dial: %v", err)
		return nil, err
	}
	log.Printf("Connected to caster at %s", casterUrl)

	castingClient := caster.NewCastingClient(conn)
	chromecastClient := caster.NewChromecastClient(conn)

	return &casterConnection{castingClient, chromecastClient, conn}, nil
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

func (c *casterConnection) FindChromecasts(eventHandler func(name string, lost bool)) {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Hour)
	defer cancel()
	stream, err := c.chromecastClient.FindChromecasts(ctx, &emptypb.Empty{})
	if err != nil {
		log.Fatalf("failed to get chromecast stream: %v", err)
	}

	for {
		event, err := stream.Recv()
		if err == io.EOF {
			// read done.
			break
		}
		if err != nil {
			log.Fatalf("Failed to receive a chromecast : %v", err)
		}
		log.Printf("Got chromecast %s with status %v", event.ChromecastName, event.ChromecastStatus)
		go eventHandler(event.ChromecastName, event.ChromecastStatus == caster.Status_LOST)
	}
}

func (c *casterConnection) CloseConnection() error {
	return c.conn.Close()
}
