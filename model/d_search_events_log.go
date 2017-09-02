package model

import (
	"context"
	"time"

	"google.golang.org/appengine/datastore"

	"github.com/enow-dev/enow/util"
	"github.com/mjibson/goon"
)

// SearchEventsLogDB イベント検索indexのログ情報
type SearchEventsLogDB struct {
}

// SearchEventsLog イベント検索indexのログ情報
type SearchEventsLog struct {
	ID             int64     `datastore:"-" goon:"id" json:"id"`
	Identification string    `json:"identification" datastore:""`
	CreatedAt      time.Time `json:"created_at"`
}

// Add レコードを追加して、追加したレコードを返す
func (db *SearchEventsLogDB) Add(appCtx context.Context, sel *SearchEventsLog) (*SearchEventsLog, error) {
	g := goon.FromContext(appCtx)
	_, err := g.Put(sel)
	if err != nil {
		return nil, err
	}
	err = g.Get(sel)
	if err != nil {
		return nil, err
	}
	return sel, nil
}

// GetLatestVersion 最新のindexNameを取得する
func (db *SearchEventsLogDB) GetLatestVersion(appCtx context.Context, createTime time.Time) (string, error) {
	g := goon.FromContext(appCtx)
	q := datastore.NewQuery(g.Kind(&SearchEventsLog{})).KeysOnly()
	q = q.Order("-CreatedAt")
	q = q.Limit(1)
	sels, err := g.GetAll(q, nil)
	if err != nil {
		return "", err
	}
	if len(sels) == 0 {
		return "", err
	}
	sel := &SearchEventsLog{
		ID: sels[0].IntID(),
	}
	err = g.Get(sel)
	if err != nil {
		return "", err
	}
	return sel.Identification, nil
}

// CreateIndex 指定したtime情報に基いてindexを作成する
func (db *SearchEventsLogDB) CreateIndex(appCtx context.Context, createTime time.Time) (string, error) {
	g := goon.FromContext(appCtx)
	sel := &SearchEventsLog{
		Identification: util.SimpleStringJoin("events", createTime.Format("20060102150405")),
		CreatedAt:      createTime,
	}
	key, err := g.Put(sel)
	if err != nil {
		return "", err
	}
	sel.ID = key.IntID()
	err = g.Get(sel)
	if err != nil {
		return "", err
	}
	return sel.Identification, nil
}
