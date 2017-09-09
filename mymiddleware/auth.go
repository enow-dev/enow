package mymiddleware

import (
	"context"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"time"

	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/model"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"github.com/mjibson/goon"
	"google.golang.org/appengine/log"
)

var (
	// ErrUnauthorized 認証フェーズ用のエラーレスポンス 401
	ErrUnauthorized = goa.NewErrorClass("unauthorized", 401)

	// ErrInternalServer 認証フェーズ用のエラーレスポンス 500
	ErrInternalServer = goa.NewErrorClass("internal error", 500)
)

// NewAdminUserAuthMiddleware adminユーザーの権限を持っているかを確認する
func NewAdminUserAuthMiddleware() goa.Middleware {
	scheme := app.NewAdminAuthSecurity()
	return func(h goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			// Retrieve and log header specified by scheme
			token := req.Header.Get(scheme.Name)
			if len(token) == 0 {
				goa.LogError(ctx, "failed api token auth")
				return ErrUnauthorized("missing auth")
			}
			// 確認ロジックを入れる
			goa.LogInfo(ctx, "auth", "apikey", "token", token)
			return h(ctx, rw, req)
		}
	}
}

// NewGeneralUserAuthMiddleware 一般ユーザーの権限を持っているかを確認する
func NewGeneralUserAuthMiddleware() goa.Middleware {
	scheme := app.NewGeneralAuthSecurity()
	return func(h goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			// Retrieve and log header specified by scheme
			token := req.Header.Get(scheme.Name)
			// 会員でないと操作出来ないのでtokenがなければはじく
			if len(token) == 0 {
				goa.LogError(ctx, "failed api token auth")
				return ErrUnauthorized("missing auth")
			}
			// tokenとユーザーを紐付ける
			uDB := model.UsersDB{}
			appCtx := appengine.NewContext(req)
			loginUserKey, err := uDB.GetUserKeyFindByToken(appCtx, token)
			if err != nil {
				log.Errorf(appCtx, "token check err = %v", err)
			}
			if loginUserKey == nil {
				goa.LogError(ctx, "user not found")
				return ErrUnauthorized("missing auth")
			}
			ctx = util.SetUserKey(ctx, loginUserKey)
			log.Infof(appCtx, "token = %v ,login userID = %d", token, loginUserKey.IntID())
			return h(ctx, rw, req)
		}
	}
}

// NewGuestUserAuthMiddleware Guestユーザーでも利用できるが、会員向けの機能もあるのでチェックする
func NewGuestUserAuthMiddleware() goa.Middleware {
	scheme := app.NewGuestAuthSecurity()
	return func(h goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			// Retrieve and log header specified by scheme
			token := req.Header.Get(scheme.Name)
			// tokenとユーザーを紐付ける
			uDB := model.UsersDB{}
			appCtx := appengine.NewContext(req)
			loginUserKey, err := uDB.GetUserKeyFindByToken(appCtx, token)
			if err != nil {
				log.Errorf(appCtx, "token check err = %v", err)
			}
			if loginUserKey != nil {
				ctx = util.SetUserKey(ctx, loginUserKey)
				log.Infof(appCtx, "token = %v ,login userID = %d", token, loginUserKey.IntID())
			}
			return h(ctx, rw, req)
		}
	}
}

// NewTestModeMiddleware tokenの存在のみチェックする動作チェック用ミドルウェア。
func NewTestModeMiddleware() goa.Middleware {
	scheme := app.NewGeneralAuthSecurity()
	return func(h goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			token := req.Header.Get(scheme.Name)
			// サンプルユーザーの作成
			g := goon.NewGoon(req)
			q := datastore.NewQuery(g.Kind(new(model.Users))).Filter("Name =", "sampleName")
			users, err := g.GetAll(q, &[]*model.Users{})
			if err != nil {
				goa.LogError(ctx, "err", err)
				return ErrInternalServer("サンプルユーザー作成時にエラーが発生しました①")
			}
			if len(users) != 0 {
				ctx = util.SetUserKey(ctx, users[0])
				return h(ctx, rw, req)
			}
			// 既にサンプルユーザーが作成されているか
			su := &model.Users{
				Name:         "sampleName",
				PasswordHash: "samplePasswordHash",
				Email:        "sampleEmail",
				FacebookID:   1,
				TwitterID:    2,
				GithubID:     3,
				GoogleID:     4,
				CreatedAt:    time.Now(),
				UpdatedAt:    time.Now(),
			}
			key, err := g.Put(su)
			if err != nil {
				goa.LogError(ctx, "err", err)
				return ErrInternalServer("サンプルユーザー作成時にエラーが発生しました")
			}
			ctx = util.SetUserKey(ctx, key)
			// 確認ロジックは省略する
			goa.LogInfo(ctx, "auth", "apikey", "token", token)
			return h(ctx, rw, req)
		}
	}
}

// NewGAECronMiddleware GAEからのリクエストか判別する
func NewGAECronMiddleware() goa.Middleware {
	scheme := app.NewGaeCronAuthSecurity()
	return func(h goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			token := req.Header.Get(scheme.Name)
			if token != "true" {
				goa.LogInfo(ctx, "failed api token auth")
				return ErrUnauthorized("missing auth")
			}
			// 確認ロジックは省略する
			goa.LogInfo(ctx, "auth", "apikey", "token", token)
			return h(ctx, rw, req)
		}
	}
}
