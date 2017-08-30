package model

import "time"

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
