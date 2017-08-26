package design

import (
	. "github.com/goadesign/goa/design/apidsl"
)

// 管理者
var AdminAuth = APIKeySecurity("adminAuth", func() {
	Description("トークン(admin)")
	Header("X-Authorization")
})

// ユーザー
var GeneralAuth = APIKeySecurity("generalAuth", func() {
	Description("トークン(student)")
	Header("X-Authorization")
})
