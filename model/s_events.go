package model

import (
	"strconv"
	"time"

	"github.com/enow-dev/enow/app"

	"google.golang.org/appengine"
	"google.golang.org/appengine/search"
)

// SearchEvents イベント検索用Document
type SearchEvents struct {
	ID             string
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

// SearchEventToEventTiny SearchEvent構造体をEventTinyにする
func (s *SearchEvents) SearchEventToEventTiny() *app.EventTiny {
	event := &app.EventTiny{}
	event.ID = s.ID
	event.APIID, _ = strconv.Atoi(s.APIID)
	event.Title = s.Title
	event.StartAt = s.StartAt
	event.EndAt = s.EndAt
	event.URL = s.URL
	event.Place = s.Place
	// TODO: タグ機能実装したら対応する
	//event.Tags = s.Tags
	event.Tags = []string{"js", "php"}
	event.Limit, _ = strconv.Atoi(s.Limit)
	event.Accepted, _ = strconv.Atoi(s.Accepted)
	event.UpdatedAt = s.UpdatedAt
	return event
}

//
//func (s *SearchEvents) SearchEventToTinyEvent() *app.EventTiny {
//	event := &app.EventTiny{}
//	event.IDStr = s.IDStr
//	event.Identification = s.Identification
//	event.APIID = s.APIID
//	event.Title = s.Title
//	event.Description = s.Description
//	event.StartAt = s.StartAt
//	event.EndAt = s.EndAt
//	event.URL = s.URL
//	event.Address = s.Address
//	event.Place = s.Place
//	event.Coords = s.Coords
//	event.Tags = s.Tags
//	event.Limit = s.Limit
//	event.Accepted = s.Accepted
//	event.Waiting = s.Waiting
//	event.Pref = s.Pref
//	event.CreatedAt = s.CreatedAt
//	event.UpdatedAt = s.UpdatedAt
//
//	return event
//}
