package model

import (
	"context"
	"time"

	"fmt"

	"github.com/enow-dev/enow/util"
	"github.com/mjibson/goon"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

// UserEventReadsDB DB
type UserEventReadsDB struct {
}

// UserEventReads ユーザーのイベント既読情報
type UserEventReads struct {
	ID         int64     `datastore:"-" goon:"id" json:"id"`
	UserID     int64     `json:"user_id" datastore:""`
	EventID    int64     `json:"event_id" datastore:""`
	EventEndAt time.Time `json:"event_end_at" datastore:""`
	CreatedAt  time.Time `json:"created_at"`
}

// Add レコードを追加して、追加したレコードを返す
func (db *UserEventReadsDB) Add(appCtx context.Context, uer *UserEventReads) {
	g := goon.FromContext(appCtx)
	_, err := g.Put(uer)
	if err != nil {
		log.Errorf(appCtx, "既読情報を挿入時にエラー(2) %v", err)
	}
}

// UpdateExcludeRedEventQ ユーザーの全ての既読情報を取得し、既読したイベントを除外するためのクエリを更新する
func (db *UserEventReadsDB) UpdateExcludeRedEventQ(appCtx context.Context, execAt time.Time) error {
	g := goon.FromContext(appCtx)

	users := []*Users{}
	q := datastore.NewQuery(g.Kind(new(Users)))
	_, err := g.GetAll(q, &users)
	if err != nil {
		log.Errorf(appCtx, "既読イベントバッチエラー(1) %v", err)
		return err
	}
	for _, u := range users {
		g := goon.FromContext(appCtx)
		log.Infof(appCtx, "%d, %v", u.ID)
		uers := []*UserEventReads{}
		// TODO: 終了したイベントに関しては削除する
		q := datastore.NewQuery(g.Kind(new(UserEventReads)))
		q = q.Filter("UserID =", u.ID)
		_, err := g.GetAll(q, &uers)
		if err != nil {
			log.Errorf(appCtx, "既読イベントバッチエラー(2) %v", err)
			continue
		}
		var eventIDs []int64
		for _, uer := range uers {
			eventIDs = append(eventIDs, uer.EventID)
		}
		eventIDs = util.RemoveDuplicateInt64(eventIDs)

		var excludeRedEventQ string
		lastIndex := len(eventIDs) - 1
		for k, eventID := range eventIDs {
			if lastIndex == k {
				excludeRedEventQ = util.DelimiterByCharCon("", excludeRedEventQ, "NOT ID:", fmt.Sprint(eventID))
			} else {
				excludeRedEventQ = util.DelimiterByCharCon("", excludeRedEventQ, "NOT ID:", fmt.Sprint(eventID), " AND")
			}
		}
		u.ExcludeRedEventQ = excludeRedEventQ
		_, err = g.Put(u)
		if err != nil {
			log.Errorf(appCtx, "既読イベントバッチエラー(3) %v", err)
			continue
		}
		// 既読イベント情報を終了したものだけ削除する
		deleteQ := datastore.NewQuery(g.Kind(new(UserEventReads)))
		deleteQ = deleteQ.KeysOnly()
		deleteQ = deleteQ.Filter("EventEndAt <", execAt)
		deleteKey, err := g.GetAll(deleteQ, nil)
		if err != nil {
			log.Errorf(appCtx, "既読イベントバッチエラー(4) %v", err)
			continue
		}
		if len(deleteKey) == 0 {
			continue
		}
		err = g.DeleteMulti(deleteKey)
		if err != nil {
			log.Errorf(appCtx, "既読イベントバッチエラー(4) %v", err)
			continue
		}
	}
	return nil
}
