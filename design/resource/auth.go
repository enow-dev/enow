package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("auth", func() {
	BasePath("/auth")
	DefaultMedia(media.Session)
	Files("/login", "public/login.html")
	Action("login", func() {
		Description("ログイン&トークン発行")
		Routing(POST("/login"))
		Params(func() {
			Param("code", String, "github OAuth2 code", func() {
				Default("")
			})
			Required("code")
		})
		UseTrait(GeneralUserTrait)
		NoSecurity()
		Response(OK)
	})
	Action("logout", func() {
		Description("ログアウト")
		Routing(POST("/logout"))
		UseTrait(GeneralUserTrait)
		Response(OK)
	})
})
