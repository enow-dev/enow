package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("auth", func() {
	BasePath("/api/auth")
	DefaultMedia(media.Session)
	Action("login", func() {
		Description("ログイン&トークン発行")
		Routing(POST("/login"))
		Payload(func() {
			Attribute("code", String, "OAuth2 code", func() {
				Default("")
				Example("6274356c1435a375d2fc")
			})
			Attribute("provider", String, "OAuth2 provider", func() {
				Enum("github", "facebook")
				Example("github")
			})
			Required("code", "provider")
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
