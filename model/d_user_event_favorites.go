package model

import (
	"time"

	"cloud.google.com/go/datastore"
)

// UserEventFavoritesDB DB
type UserEventFavoritesDB struct {
}

// UserEventFavorites ユーザーのイベントお気に入り情報
type UserEventFavorites struct {
	ID        int64          `datastore:"-" goon:"id" json:"id"`
	User      *datastore.Key `json:"user" datastore:"-" goon:"users"`
	EventID   int64          `json:"event_id" datastore:""`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}
