package model

import (
	"bytes"
	"context"
	"strconv"
	"time"

	"fmt"

	"github.com/enow-dev/enow/app"
	"google.golang.org/appengine"
	"google.golang.org/appengine/search"
)

// SearchEventsDB SearchAPIを使う
type SearchEventsDB struct {
	index     *search.Index
	indexName string
	queries   []string
	opts      *search.SearchOptions
	cursor    *search.Cursor
	Iterator  *search.Iterator
}

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

// Run 検索を実行する Cursorが存在する時は、即実行する
func (db *SearchEventsDB) Run(appCtx context.Context) (*search.Iterator, error) {
	index, err := search.Open(db.indexName)
	if err != nil {
		return nil, err
	}
	if db.cursor == nil {
		return index.Search(appCtx, "", db.opts), nil
	}
	return index.Search(appCtx, db.genQuery(), db.opts), nil
}

// NewSearchEventsDB SearchEventsDBを使うための初期処理と生成
func NewSearchEventsDB(indexName string) *SearchEventsDB {
	return &SearchEventsDB{
		indexName: indexName,
	}
}

// SetLimit 読み込みLimit数を設定する
func (db *SearchEventsDB) SetLimit(limit int) {
	if db.opts == nil {
		db.opts = &search.SearchOptions{}
	}
	if limit < 0 {
		db.opts.Limit = 10
		return
	}
	db.opts.Limit = limit
}

// SetCursor ページングに使うカーソルを設定する
func (db *SearchEventsDB) SetCursor(cursor string) {
	db.opts.Cursor = search.Cursor(cursor)
}

// Sort ソートしたいプロパティと降順昇順を設定する
func (db *SearchEventsDB) Sort(expr string, isAsc bool) {
	if expr == "" {
		return
	}
	if db.opts == nil {
		db.opts = &search.SearchOptions{}
	}
	if db.opts.Sort == nil {
		db.opts.Sort = &search.SortOptions{}
	}
	db.opts.Sort.Expressions = append(db.opts.Sort.Expressions, search.SortExpression{
		Expr:    expr,
		Reverse: isAsc,
	})
}

// SetSearchKeyword ワード検索する
func (db *SearchEventsDB) SetSearchKeyword(q string) {
	if q == "" {
		return
	}
	db.queries = append(db.queries, fmt.Sprintf("(Description:%s OR Title:%s)", q, q))
}

// SetPref 都道府県を設定する
func (db *SearchEventsDB) SetPref(pref int) {
	if pref == 0 {
		return
	}
	db.queries = append(db.queries, fmt.Sprintf("Pref=%d", pref))
}

// SetNotSearchID 既読しているIDを検索から除外する
func (db *SearchEventsDB) SetNotSearchID(ignoreIDQuery string) {
	if ignoreIDQuery == "" {
		return
	}
	db.queries = append(db.queries, fmt.Sprintf("%s", ignoreIDQuery))
}

func concatenateString(strs ...string) string {
	var concatenateStr bytes.Buffer
	for _, v := range strs {
		concatenateStr.Write([]byte(v))
		concatenateStr.Write([]byte{' '})
	}
	return concatenateStr.String()
}

func (db *SearchEventsDB) genQuery() string {
	// TODO 現状はANDのみ対応
	if len(db.queries) == 0 {
		return ""
	}
	q := ""
	lastIndex := len(db.queries) - 1
	for k, v := range db.queries {
		q = concatenateString(q, fmt.Sprintf("%s AND", v))
		if k == lastIndex {
			q = concatenateString(q, fmt.Sprintf("%s", v))
		}
	}
	return q
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
