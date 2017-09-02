package model

import (
	"context"
	"time"

	"github.com/mjibson/goon"
	"google.golang.org/appengine/log"
)

// UserEventReadsDB DB
type UserEventReadsDB struct {
}

// UserEventReads ユーザーのイベント既読情報
type UserEventReads struct {
	ID        int64     `datastore:"-" goon:"id" json:"id"`
	UserID    int64     `json:"user_id" datastore:""`
	EventID   int64     `json:"event_id" datastore:""`
	CreatedAt time.Time `json:"created_at"`
}

// Add レコードを追加して、追加したレコードを返す
func (db *UserEventReadsDB) Add(appCtx context.Context, uer *UserEventReads) {
	g := goon.FromContext(appCtx)
	_, err := g.Put(uer)
	if err != nil {
		log.Errorf(appCtx, "既読情報を挿入時にエラー(2) %v", err)
	}
}
