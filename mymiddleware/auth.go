package mymiddleware

import (
	"context"
	"net/http"

	"github.com/enow-dev/enow/app"
	"github.com/goadesign/goa"
)

var (
	// ErrUnauthorized is the error returned for unauthorized requests.
	ErrUnauthorized = goa.NewErrorClass("unauthorized", 401)
)

// NewAdminUserAuthMiddleware adminユーザーの権限を持っているかを確認する
func NewAdminUserAuthMiddleware() goa.Middleware {
	scheme := app.NewAdminAuthSecurity()
	return func(h goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			// Retrieve and log header specified by scheme
			token := req.Header.Get(scheme.Name)
			// A real app would do something more interesting here
			if len(token) == 0 {
				goa.LogInfo(ctx, "failed api token auth")
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
			// A real app would do something more interesting here
			if len(token) == 0 {
				goa.LogInfo(ctx, "failed api token auth")
				return ErrUnauthorized("missing auth")
			}
			// 確認ロジックを入れる
			goa.LogInfo(ctx, "auth", "apikey", "token", token)
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
			if len(token) == 0 {
				goa.LogInfo(ctx, "failed api token auth")
				return ErrUnauthorized("missing auth")
			}
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
