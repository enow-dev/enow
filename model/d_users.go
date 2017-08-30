package model

import (
	"context"
	"fmt"
	"time"

	"github.com/enow-dev/enow/app"
	"github.com/mjibson/goon"
	"google.golang.org/appengine/datastore"
)

// UsersDB DB
type UsersDB struct {
}

// Users ユーザー情報
type Users struct {
	ID           int64     `datastore:"-" goon:"id" json:"id"`
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

// nolint
func (db *UsersDB) GetFindByName(ctx context.Context, name string) ([]*app.User, error) {
	g := goon.FromContext(ctx)
	as := []*Users{}
	q := datastore.NewQuery(g.Kind(new(Users))).Filter("name =", name)
	_, err := g.GetAll(q, &as)
	if err != nil {
		return nil, err
	}
	var appAs []*app.User
	for _, t := range as {
		appAs = append(appAs, t.UserToUser())
	}

	return appAs, nil
}

// nolint
func (db *UsersDB) Get(ctx context.Context, id int64) (*Users, error) {
	g := goon.FromContext(ctx)
	u := Users{
		ID: id,
	}
	err := g.Get(&u)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// nolint
func (db *UsersDB) Add(ctx context.Context, user *Users) (*Users, error) {
	g := goon.FromContext(ctx)
	_, err := g.Put(user)
	if err != nil {
		return nil, err
	}
	err = g.Get(user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// nolint
func (db *UsersDB) Delete(ctx context.Context, id int64) error {
	g := goon.FromContext(ctx)
	u := &Users{
		ID: id,
	}
	err := g.Get(u)
	if err != nil {
		return err
	}
	err = g.Delete(g.Key(u))
	if err != nil {
		return err
	}
	return nil
}

// nolint
func (db *UsersDB) Update(ctx context.Context, id int64, updateUser *Users) (*Users, error) {
	g := goon.FromContext(ctx)
	findUser := &Users{
		ID: id,
	}
	err := g.RunInTransaction(func(g *goon.Goon) error {
		err := g.Get(findUser)
		if err != nil {
			return err
		}
		updateUser.ID = findUser.ID
		_, err = g.Put(updateUser)
		if err != nil {
			return err
		}
		return nil
	}, nil)
	if err != nil {
		return nil, err
	}
	return updateUser, nil
}

// nolint
func (u *Users) UserToUser() *app.User {
	user := &app.User{}
	user.ID = fmt.Sprintf("%v", u.ID)
	user.Name = u.Name
	return user
}
