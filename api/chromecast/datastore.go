package chromecast

import "context"

type DataStore interface {
	SaveCurrentlyPlaying(ctx context.Context, cp CurrentlyPlaying) error
	GetCurrentlyPlaying(ctx context.Context) ([]CurrentlyPlaying, error)
	DeleteCurrentPlaying(ctx context.Context, chromecast string) error
}
