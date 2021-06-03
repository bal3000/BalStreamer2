package chromecast

import "context"

type DataStore interface {
	SaveCurrentlyPlaying(ctx context.Context, cp CurrentlyPlaying) error
	GetCurrentlyPlaying(ctx context.Context) ([]CurrentlyPlaying, error)
}
