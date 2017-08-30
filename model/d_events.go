package model

import (
	"context"
	"fmt"
	"time"

	"github.com/enow-dev/enow/app"
	"github.com/mjibson/goon"
	"google.golang.org/appengine"
)

// EventsDB DB
type EventsDB struct {
}

// Events イベント情報
type Events struct {
	ID             int64              `datastore:"-" goon:"id" json:"id"`
	Identification string             `json:"identification" datastore:",noindex"`
	APIID          int                `json:"api_id" datastore:""`
	APIEventID     int                `json:"api_event_id" datastore:",noindex"`
	Title          string             `json:"title" datastore:",noindex"`
	Description    string             `json:"description" datastore:",noindex"`
	StartAt        time.Time          `json:"start_at" datastore:""`
	EndAt          time.Time          `json:"end_at" datastore:""`
	URL            string             `json:"url" datastore:",noindex"`
	Hash           string             `json:"hash" datastore:""`
	Address        string             `json:"address" datastore:""`
	Place          string             `json:"place" datastore:""`
	Coords         appengine.GeoPoint `json:"coords" datastore:""`
	Tags           []string           `json:"tags" datastore:",noindex"`
	Limit          int                `json:"limit" datastore:""`
	Accepted       int                `json:"accepted" datastore:""`
	Waiting        int                `json:"waiting" datastore:""`
	Pref           int                `json:"pref" datastore:""`
	CreatedAt      time.Time          `json:"created_at"`
	UpdatedAt      time.Time          `json:"updated_at"`
}

// Get IDを指定し1件取得する
func (db *EventsDB) Get(ctx context.Context, id int64) (*Events, error) {
	g := goon.FromContext(ctx)
	e := &Events{
		ID: id,
	}
	err := g.Get(e)
	if err != nil {
		return nil, err
	}
	return e, nil
}

// Add レコードを追加して、追加したレコードを返す
func (db *EventsDB) Add(ctx context.Context, user *Events) (*Events, error) {
	g := goon.FromContext(ctx)
	_, err := g.Put(user)
	if err != nil {
		return nil, err
	}
	err = g.Get(user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Delete ID指定して、1件削除する
func (db *EventsDB) Delete(ctx context.Context, id int64) error {
	g := goon.FromContext(ctx)
	u := &Events{
		ID: id,
	}
	err := g.Get(u)
	if err != nil {
		return err
	}
	err = g.Delete(g.Key(u))
	if err != nil {
		return err
	}
	return nil
}

// Update id指定して、1件更新しその情報を返す
func (db *EventsDB) Update(ctx context.Context, id int64, updateEvent *Events) (*Events, error) {
	g := goon.FromContext(ctx)
	findUser := &Events{
		ID: id,
	}
	err := g.RunInTransaction(func(g *goon.Goon) error {
		err := g.Get(findUser)
		if err != nil {
			return err
		}
		updateEvent.ID = findUser.ID
		_, err = g.Put(updateEvent)
		if err != nil {
			return err
		}
		return nil
	}, nil)
	if err != nil {
		return nil, err
	}
	return updateEvent, nil
}

// EventToEventShow EventをEventShow構造体に移す
func (e *Events) EventToEventShow() *app.EventShow {
	event := &app.EventShow{}
	event.ID = fmt.Sprintf("%v", e.ID)
	event.APIID = e.APIID
	event.Title = e.Title
	event.Description = e.Description
	event.StartAt = e.StartAt
	event.EndAt = e.EndAt
	event.URL = e.URL
	event.Address = e.Address
	event.Place = e.Place
	event.Lat = e.Coords.Lat
	event.Lon = e.Coords.Lng
	// TODO: タグ機能実装したら対応する
	//event.Tags          = e.Tags
	event.Tags = []string{"js", "php"}
	event.Limit = e.Limit
	event.Accepted = e.Accepted
	event.Waiting = e.Waiting
	event.UpdatedAt = e.UpdatedAt
	// TODO お気にい入り機能作ったら判定して格納する
	return event
}
