package model

import "time"

// UserEventReadsDB DB
type UserEventReadsDB struct {
}

// UserEventReads ユーザーのイベント既読情報
type UserEventReads struct {
	_kind     string    `goon:"kind,user_event_reads"`
	ID        int64     `datastore:"-" goon:"id" json:"id"`
	IDStr     string    `json:"id_str" datastore:""`
	UserID    int64     `json:"user_id" datastore:""`
	EventID   int64     `json:"event_id" datastore:""`
	CreatedAt time.Time `json:"created_at"`
}
