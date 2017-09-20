package model

import (
	"context"
	"fmt"
	"time"

	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/config"
	"github.com/mjibson/goon"
	"google.golang.org/appengine/datastore"
)

// UsersDB DB
type UsersDB struct {
}

// Users ユーザー情報
type Users struct {
	ID               int64     `datastore:"-" goon:"id" json:"id"`
	Name             string    `json:"name" datastore:""`
	PasswordHash     string    `json:"password_hash" datastore:",noindex"`
	Token            string    `json:"token" datastore:""`
	Email            string    `json:"email" datastore:""`
	AvaterURL        string    `json:"avater_url" datastore:",noindex"`
	ExcludeRedEventQ string    `json:"exclude_red_event_q" datastore:",noindex"`
	FacebookID       int64     `json:"facebook_id" datastore:""`
	TwitterID        int64     `json:"twitter_id" datastore:""`
	GithubID         int64     `json:"github_id" datastore:""`
	GoogleID         int64     `json:"google_id" datastore:""`
	FavoriteTags     []string  `json:"favorite_tags" datastore:""`
	Expire           time.Time `json:"expire" datastore:""`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// nolint
func (db *UsersDB) GetFindByName(appCtx context.Context, name string) ([]*app.User, error) {
	g := goon.FromContext(appCtx)
	as := []*Users{}
	q := datastore.NewQuery(g.Kind(new(Users))).Filter("Name =", name)
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
func (db *UsersDB) GetKeyFindByOauthID(appCtx context.Context, id int64, oauthType string) (*datastore.Key, error) {
	g := goon.FromContext(appCtx)
	as := []*Users{}

	var filterTerm string
	// TODO: GoogleとTwitterの対応もする
	switch oauthType {
	case config.FacebookOAuth:
		filterTerm = "FacebookID ="
	case config.GithubOAuth:
		filterTerm = "GithubID ="
	}

	q := datastore.NewQuery(g.Kind(new(Users)))
	q = q.Filter(filterTerm, id)
	q = q.KeysOnly()
	keys, err := g.GetAll(q, &as)
	if err != nil {
		return nil, err
	}
	if len(keys) == 0 {
		return nil, nil
	}
	return keys[0], nil
}

// nolint
func (db *UsersDB) Get(appCtx context.Context, id int64) (*Users, error) {
	g := goon.FromContext(appCtx)
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
func (db *UsersDB) Add(appCtx context.Context, user *Users) (*Users, error) {
	g := goon.FromContext(appCtx)
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
func (db *UsersDB) Delete(appCtx context.Context, id int64) error {
	g := goon.FromContext(appCtx)
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
func (db *UsersDB) Update(appCtx context.Context, id int64, updateUser *Users) (*Users, error) {
	g := goon.FromContext(appCtx)
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
func (db *UsersDB) UpdateToken(appCtx context.Context, key *datastore.Key, createTime time.Time, token string) (*Users, error) {
	user := &Users{}
	err := datastore.Get(appCtx, key, user)
	if err != nil {
		return nil, err
	}
	// 期限を一週間後にする
	user.Expire = createTime.AddDate(0, 0, 7)
	user.Token = token
	user.UpdatedAt = createTime
	_, err = datastore.Put(appCtx, key, user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// nolint
func (db *UsersDB) GetUserKeyFindByToken(appCtx context.Context, token string) (*datastore.Key, error) {
	g := goon.FromContext(appCtx)
	as := []*Users{}
	q := datastore.NewQuery(g.Kind(new(Users))).Filter("Token =", token).KeysOnly()
	keys, err := g.GetAll(q, &as)
	if err != nil {
		return nil, err
	}
	if len(keys) == 0 {
		return nil, nil
	}
	return keys[0], nil
}

// AddFavoriteTag お気に入りタグを登録する　既に登録されている場合はエラーとせず終了する
func (db *UsersDB) AddFavoriteTag(appCtx context.Context, tagName string, userKey *datastore.Key) error {
	g := goon.FromContext(appCtx)
	// タグの存在チェック
	tDB := TagsDB{}
	tags, err := tDB.GetFindByTag(appCtx, tagName)
	if err != nil {
		return err
	}
	if len(tags) == 0 {
		return fmt.Errorf("存在しないタグが指定されています")
	}
	// お気に入りタグ追加
	user, err := db.Get(appCtx, userKey.IntID())
	if err != nil {
		return err
	}
	// まだお気に入り登録がされていない
	if len(user.FavoriteTags) == 0 {
		user.FavoriteTags = append(user.FavoriteTags, tagName)
	} else {
		// 既に登録されているタグの場合は終了する
		if isExistsAlready(user.FavoriteTags, tagName) {
			return nil
		}
		// 既に存在している場合はタグ追加
		user.FavoriteTags = append(user.FavoriteTags, tagName)
	}
	_, err = g.Put(user)
	if err != nil {
		return err
	}
	return nil
}

// DeleteFavoriteTag お気に入りタグを削除する　登録されていない又は該当タグがない場合はエラーとせず終了する
func (db *UsersDB) DeleteFavoriteTag(appCtx context.Context, tagName string, userKey *datastore.Key) error {
	g := goon.FromContext(appCtx)
	user, err := db.Get(appCtx, userKey.IntID())
	if err != nil {
		return err
	}
	if len(user.FavoriteTags) == 0 {
		return nil
	}
	// 該当のタグを削除
	user.FavoriteTags = deleteSliceSpecifiedString(user.FavoriteTags, tagName)
	_, err = g.Put(user)
	if err != nil {
		return err
	}
	return nil
}

func deleteSliceSpecifiedString(strings []string, search string) []string {
	result := []string{}
	for _, v := range strings {
		if v != search {
			result = append(result, v)
		}
	}
	return result
}

func isExistsAlready(s []string, e string) bool {
	for _, v := range s {
		if e == v {
			return true
		}
	}
	return false
}

// nolint
func (u *Users) UserToUser() *app.User {
	user := &app.User{}
	user.ID = fmt.Sprintf("%v", u.ID)
	user.Name = u.Name
	return user
}
