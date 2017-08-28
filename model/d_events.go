package model

import (
	"time"

	"google.golang.org/appengine"
)

// EventsDB DB
type EventsDB struct {
}

// Events イベント情報
type Events struct {
	_kind          string             `goon:"kind,events"`
	ID             int64              `datastore:"-" goon:"id" json:"id"`
	IDStr          string             `json:"id_str" datastore:""`
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
