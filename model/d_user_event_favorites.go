package model

import (
	"context"
	"time"

	"github.com/mjibson/goon"
	"google.golang.org/appengine/datastore"
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
	UpdatedAt time.Time      `json:"updated_at"`
}

// Add お気に入りを追加する　既に追加されている場合は無視する
func (db *UserEventFavoritesDB) Add(appCtx context.Context, eventID int64, userKey *datastore.Key) error {
	g := goon.FromContext(appCtx)
	q := datastore.NewQuery(g.Kind(&UserEventFavorites{})).KeysOnly()
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
		Users:   userKey,
		EventID: eventID,
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
	q := datastore.NewQuery(g.Kind(&UserEventFavorites{})).KeysOnly()
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
