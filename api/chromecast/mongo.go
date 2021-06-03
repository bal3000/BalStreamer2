package chromecast

import (
	"context"
	"errors"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ChromecastMongoStore struct {
	dbClient *mongo.Client
}

func NewChromecastMongoStore(parentCtx context.Context, conn string) (*ChromecastMongoStore, func(), error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(conn))
	if err != nil {
		return nil, nil, err
	}

	ctx, cancel := context.WithTimeout(parentCtx, 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		return nil, nil, err
	}

	return &ChromecastMongoStore{dbClient: client}, func() {
		log.Println("closing mongo db connection")
		client.Disconnect(ctx)
	}, nil
}

func (ds *ChromecastMongoStore) SaveCurrentlyPlaying(ctx context.Context, cp CurrentlyPlaying) error {
	if ds == nil {
		return errors.New("the data store has not been initialized")
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	database := ds.dbClient.Database("balstreamer")
	col := database.Collection("currentplaying")

	result := col.FindOneAndReplace(timeoutCtx, bson.M{"chromecast": cp.Chromecast}, cp)
	err := result.Err()
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// no documents in db so add it
			if _, err := col.InsertOne(timeoutCtx, cp); err != nil {
				return err
			}
		} else {
			return err
		}
	}

	return nil
}

func (ds *ChromecastMongoStore) GetCurrentlyPlaying(ctx context.Context) ([]CurrentlyPlaying, error) {
	if ds == nil {
		return nil, errors.New("the data store has not been initialized")
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	database := ds.dbClient.Database("balstreamer")
	col := database.Collection("currentplaying")

	result, err := col.Find(timeoutCtx, bson.M{})
	if err != nil {
		return nil, err
	}

	var playing []CurrentlyPlaying
	err = result.All(timeoutCtx, &playing)
	if err != nil {
		return nil, err
	}

	return playing, nil
}

func (ds *ChromecastMongoStore) DeleteCurrentPlaying(ctx context.Context, chromecast string) error {
	if ds == nil {
		return errors.New("the data store has not been initialized")
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	database := ds.dbClient.Database("balstreamer")
	col := database.Collection("currentplaying")

	_, err := col.DeleteOne(timeoutCtx, bson.M{"chromecast": chromecast})
	if err != nil {
		return err
	}

	return nil
}
