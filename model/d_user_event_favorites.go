package model

import (
	"context"
	"time"

	"fmt"

	"github.com/enow-dev/enow/app"
	"github.com/mjibson/goon"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

// UserEventFavoritesDB DB
type UserEventFavoritesDB struct {
}

// UserEventFavorites ユーザーのイベントお気に入り情報
type UserEventFavorites struct {
	ID        int64          `datastore:"-" goon:"id" json:"id"`
	Users     *datastore.Key `datastore:"-" goon:"parent"`
	EventID   int64          `json:"event_id" datastore:""`
	CreatedAt time.Time      `json:"created_at"`
}

// nolint
func (db *UserEventFavoritesDB) GetListFindByUserKey(appCtx context.Context, userKey *datastore.Key, setCursor string) ([]*app.EventTiny, datastore.Cursor, error) {
	g := goon.FromContext(appCtx)
	q := datastore.NewQuery(g.Kind(new(UserEventFavorites)))
	q = q.Ancestor(userKey)
	q = q.Limit(20)
	cursor, err := datastore.DecodeCursor(setCursor)
	if err == nil {
		q = q.Start(cursor)
	}
	t := q.Run(appCtx)
	var appEvents []*app.EventTiny
	for {
		var uef UserEventFavorites
		_, err := t.Next(&uef)
		if err == datastore.Done {
			break
		}
		if err != nil {
			log.Errorf(appCtx, "%v", err)
			break
		}
		eDB := EventsDB{}
		event, err := eDB.Get(appCtx, uef.EventID)
		if err != nil {
			log.Errorf(appCtx, "%v", err)
			break
		}
		e := event.EventToEventTiny()
		e.IsFavorite = true
		e.IsRed = true
		appEvents = append(appEvents, e)
	}
	cursor, err = t.Cursor()
	if err != nil {
		return nil, datastore.Cursor{}, err
	}
	return appEvents, cursor, nil
}

// IsFavoriteEvent お気に入り済みイベントか
func (db *UserEventFavoritesDB) IsFavoriteEvent(appCtx context.Context, eventID int64, userKey *datastore.Key) (bool, error) {
	g := goon.FromContext(appCtx)
	uefs := []*UserEventFavorites{}
	q := datastore.NewQuery(g.Kind(new(UserEventFavorites)))
	q = q.Ancestor(userKey)
	q = q.Filter("EventID =", eventID)
	keys, err := g.GetAll(q, &uefs)
	if err != nil {
		return false, err
	}
	if len(keys) == 0 {
		return false, nil
	}
	return true, nil
}

// Add お気に入りを追加する　既に追加されている場合は無視する
func (db *UserEventFavoritesDB) Add(appCtx context.Context, eventID int64, userKey *datastore.Key, createAt time.Time) error {
	g := goon.FromContext(appCtx)
	eDB := EventsDB{}
	_, err := eDB.Get(appCtx, eventID)
	if err == datastore.ErrNoSuchEntity {
		return fmt.Errorf("存在しないイベントIDが指定されています")
	}

	q := datastore.NewQuery(g.Kind(new(UserEventFavorites)))
	q = q.KeysOnly()
	q = q.Ancestor(userKey)
	q = q.Filter("EventID =", eventID)
	count, err := g.GetAll(q, nil)
	if err != nil {
		return err
	}
	// 既に登録されている場合、そのまま処理を終了する
	if len(count) > 0 {
		return nil
	}
	uef := &UserEventFavorites{
		Users:     userKey,
		EventID:   eventID,
		CreatedAt: createAt,
	}
	_, err = g.Put(uef)
	if err != nil {
		return err
	}
	return nil
}

// Delete ID指定して、1件削除する　誤って追加されてる可能生のある情報もまとめて削除する仕様になっている
func (db *UserEventFavoritesDB) Delete(appCtx context.Context, eventID int64, userKey *datastore.Key) error {
	g := goon.FromContext(appCtx)
	q := datastore.NewQuery(g.Kind(new(UserEventFavorites)))
	q = q.KeysOnly()
	q = q.Ancestor(userKey)
	q = q.Filter("EventID = ", eventID)
	count, err := g.GetAll(q, nil)
	if err != nil {
		return err
	}
	// 存在しない場合、そのまま処理を終了する
	if len(count) == 0 {
		return nil
	}
	err = g.DeleteMulti(count)
	if err != nil {
		return err
	}
	return nil
}
