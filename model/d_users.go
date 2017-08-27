package model

import "time"

// UsersDB DB
type UsersDB struct {
}

// Users ユーザー情報
type Users struct {
	_kind        string    `goon:"kind,User"`
	ID           int64     `datastore:"-" goon:"id" json:"id"`
	IDStr        string    `json:"id_str" datastore:""`
	Name         string    `json:"name" datastore:""`
	PasswordHash string    `json:"password_hash" datastore:",noindex"`
	Email        string    `json:"email" datastore:""`
	FacebookID   int       `json:"facebook_id" datastore:""`
	TwitterID    int       `json:"twitter_id" datastore:""`
	GithubID     int       `json:"github_id" datastore:""`
	GoogleID     int       `json:"google_id" datastore:""`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
