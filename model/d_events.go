package model

import (
	"context"
	"fmt"
	"time"

	"github.com/enow-dev/enow/app"
	"github.com/mjibson/goon"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

// EventsDB DB
type EventsDB struct {
}

// Events イベント情報
type Events struct {
	ID             int64              `datastore:"-" goon:"id" json:"id"`
	Identification string             `json:"identification" datastore:""`
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
func (db *EventsDB) Get(appCtx context.Context, id int64) (*Events, error) {
	g := goon.FromContext(appCtx)
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
func (db *EventsDB) Add(appCtx context.Context, event *Events) (*Events, error) {
	g := goon.FromContext(appCtx)
	_, err := g.Put(event)
	if err != nil {
		return nil, err
	}
	err = g.Get(event)
	if err != nil {
		return nil, err
	}
	return event, nil
}

// Upsert レコードが無ければ追加して、あれば更新する 更新したかどうかをboolで返す
func (db *EventsDB) Upsert(appCtx context.Context, newEvent *Events) (bool, error) {
	g := goon.FromContext(appCtx)
	q := datastore.NewQuery(g.Kind(&Events{})).KeysOnly()
	q = q.Filter("Identification = ", newEvent.Identification)
	events, err := g.GetAll(q, nil)
	if err != nil {
		return false, err
	}
	// 1件も存在しない場合は作成する
	if len(events) == 0 {
		_, err = g.Put(newEvent)
		if err != nil {
			return false, err
		}
		return false, err
	}
	// 存在する場合は古いデータを取得し、新しければ更新する
	oldEvent := &Events{
		ID: events[0].IntID(),
	}
	err = g.Get(oldEvent)
	if err != nil {
		return false, err
	}
	// データが更新されていなければreturnする
	if newEvent.UpdatedAt.Unix() >= oldEvent.UpdatedAt.Unix() {
		return false, err
	}
	newEvent.ID = oldEvent.ID
	_, err = g.Put(newEvent)
	if err != nil {
		return false, err
	}
	return true, nil
}

// Delete ID指定して、1件削除する
func (db *EventsDB) Delete(appCtx context.Context, id int64) error {
	g := goon.FromContext(appCtx)
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
func (db *EventsDB) Update(appCtx context.Context, id int64, updateEvent *Events) (*Events, error) {
	g := goon.FromContext(appCtx)
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

// EventToEventTiny EventをEventShow構造体に移す
func (e *Events) EventToEventTiny() *app.EventTiny {
	event := &app.EventTiny{}
	event.ID = fmt.Sprintf("%v", e.ID)
	event.APIID = e.APIID
	event.Title = e.Title
	event.StartAt = e.StartAt
	event.EndAt = e.EndAt
	event.URL = e.URL
	event.Place = e.Place
	// TODO: タグ機能実装したら対応する
	//event.Tags          = e.Tags
	event.Tags = []string{"js", "php"}
	event.Limit = e.Limit
	event.Accepted = e.Accepted
	event.UpdatedAt = e.UpdatedAt
	// TODO お気にい入り機能作ったら判定して格納する
	return event
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
