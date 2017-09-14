package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("users", func() {
	BasePath("/users")
	DefaultMedia(media.User)
	Action("show", func() {
		Description("show")
		Routing(GET("/self"))
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
	Action("update", func() {
		Description("update")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", Integer, "id")
			Required("id")
		})
		Payload(func() {
			Param("name", String, "ユーザー名")
			Required("name")
		})
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
	Action("delete", func() {
		Description("delete")
		Routing(DELETE("/self"))
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
})