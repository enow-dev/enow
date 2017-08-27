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
	Hash           string
	Address        string
	Place          string
	Coords         appengine.GeoPoint
	Tags           search.Atom
	Limit          float64
	Accepted       float64
	Waiting        float64
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
