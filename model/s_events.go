package model

import (
	"time"

	"google.golang.org/appengine"
	"google.golang.org/appengine/search"
)

// SearchEvents イベント検索用Document
type SearchEvents struct {
	IDStr          string
	Identification string
	APIID          string
	Title          string
	Description    search.HTML
	StartAt        time.Time
	EndAt          time.Time
	URL            string
	Address        string
	Place          string
	Coords         appengine.GeoPoint
	Tags           search.Atom
	Limit          string
	Accepted       string
	Waiting        string
	Pref           string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
