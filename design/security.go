package design

import (
	. "github.com/goadesign/goa/design/apidsl"
)

// 管理者
var AdminAuth = APIKeySecurity("adminAuth", func() {
	Description("トークン(admin)")
	Header("X-Authorization")
})

// 会員ユーザー
var GeneralAuth = APIKeySecurity("generalAuth", func() {
	Description("トークン(student)")
	Header("X-Authorization")
})

// ゲスト
var GuestAuth = APIKeySecurity("guestAuth", func() {
	Description("トークン(guest)")
	Header("X-Authorization")
})
