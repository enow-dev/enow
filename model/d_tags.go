package model

import (
	"context"

	"google.golang.org/appengine/datastore"

	"fmt"

	"github.com/dlclark/regexp2"
	"github.com/mjibson/goon"
)

// TagsDB DB
type TagsDB struct {
}

// Tags イベント情報
type Tags struct {
	ID        int64  `datastore:"-" goon:"id" json:"id"`
	MajorTags string `json:"magor_tags" datastore:""`
	Name      string `json:"name" datastore:""`
	Regex     string `json:"regex" datastore:""`
}

// nolint
func (db *TagsDB) GetAll(appCtx context.Context) ([]*Tags, error) {
	g := goon.FromContext(appCtx)
	ts := []*Tags{}
	q := datastore.NewQuery(g.Kind(new(Tags)))
	_, err := g.GetAll(q, &ts)
	if err != nil {
		return nil, err
	}
	return ts, nil
}

// Get IDを指定し1件取得する
func (db *TagsDB) Get(appCtx context.Context, id int64) (*Tags, error) {
	g := goon.FromContext(appCtx)
	e := &Tags{
		ID: id,
	}
	err := g.Get(e)
	if err != nil {
		return nil, err
	}
	return e, nil
}

// Add レコードを追加して、追加したレコードを返す
func (db *TagsDB) Add(appCtx context.Context, tag *Tags) (*Tags, error) {
	g := goon.FromContext(appCtx)
	_, err := g.Put(tag)
	if err != nil {
		return nil, err
	}
	err = g.Get(tag)
	if err != nil {
		return nil, err
	}
	return tag, nil
}

// Delete ID指定して、1件削除する
func (db *TagsDB) Delete(appCtx context.Context, id int64) error {
	g := goon.FromContext(appCtx)
	u := &Events{
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

// Update id指定して、1件更新しその情報を返す
func (db *TagsDB) Update(appCtx context.Context, id int64, updateTag *Tags) (*Tags, error) {
	g := goon.FromContext(appCtx)
	findUser := &Events{
		ID: id,
	}
	err := g.RunInTransaction(func(g *goon.Goon) error {
		err := g.Get(findUser)
		if err != nil {
			return err
		}
		updateTag.ID = findUser.ID
		_, err = g.Put(updateTag)
		if err != nil {
			return err
		}
		return nil
	}, nil)
	if err != nil {
		return nil, err
	}
	return updateTag, nil
}

// Upgrade Tag情報をtags.yamlの内容にアップグレードする
func (db *TagsDB) Upgrade(appCtx context.Context, tags *[]Tags) error {
	g := goon.FromContext(appCtx)
	q := datastore.NewQuery(g.Kind(new(Tags))).KeysOnly()
	tk, err := g.GetAll(q, nil)
	if err != nil {
		return err
	}
	_, err = g.PutMulti(tags)
	if err != nil {
		return err
	}
	err = g.DeleteMulti(tk)
	if err != nil {
		return err
	}
	return nil
}

// ExistsTargetTag イベントの情報からタグ付けをする（Javaに限っては例外処理あり）
func ExistsTargetTag(regex string, target ...string) (bool, error) {
	r, err := regexp2.Compile(fmt.Sprint(`(?i)`, regex), 0) // Do we have an 'N' or 'n' at the beginning?
	if err != nil {
		return false, err
	}
	// targetとなるもののいずれかがヒットした時点でreturnする
	for _, v := range target {
		isExisted, err := r.MatchString(v)
		if err != nil {
			return false, err
		}
		if isExisted {
			return true, nil
		}
	}
	return false, nil
}
