package util

import (
	"context"
	"fmt"

	"google.golang.org/appengine/datastore"
)

// ContextKey Contextのキーを扱うためのstring
type ContextKey string

// Context内の値にアクセスするための定数キー
const (
	ContextUserKey ContextKey = "userKey"
)

// SetUserKey ContextにUserKeyを格納する
func SetUserKey(parents context.Context, userKey *datastore.Key) context.Context {
	return context.WithValue(parents, ContextUserKey, userKey)
}

// GetUserKey Contextに入っているUserKeyを取り出す
func GetUserKey(ctx context.Context) (*datastore.Key, error) {
	v := ctx.Value(ContextUserKey)
	userKey, ok := v.(*datastore.Key)
	if !ok {
		return nil, fmt.Errorf("userID not found")
	}
	return userKey, nil
}
