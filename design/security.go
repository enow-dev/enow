package design

import (
	. "github.com/goadesign/goa/design/apidsl"
)

// 管理者しか使えない機能
var AdminAuth = APIKeySecurity("adminAuth", func() {
	Description("トークン(admin)")
	Header("X-Authorization")
})

// ユーザーしか使えない機能
var GeneralAuth = APIKeySecurity("generalAuth", func() {
	Description("トークン(general)")
	Header("X-Authorization")
})

// ゲストでも使える機能
var GuestAuth = APIKeySecurity("guestAuth", func() {
	Description("トークン(guest)")
	Header("X-Authorization")
})

// cron
var GAECronAuth = APIKeySecurity("gaeCronAuth", func() {
	Description("gae cron")
	Header("X-Appengine-Cron")
})
