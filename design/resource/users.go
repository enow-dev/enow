package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("users", func() {
	BasePath("/api/users")
	DefaultMedia(media.User)
	Action("show", func() {
		Description("show")
		Routing(GET("/self"))
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
	Action("update", func() {
		Description("update")
		Routing(PUT("/self"))
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
	Action("updateTag", func() {
		Description("お気に入りタグに追加する")
		Routing(PUT("/self/:tag"))
		Params(func() {
			Param("tag", String, "タグ")
			Required("tag")
		})
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
	Action("deleteTag", func() {
		Description("お気に入りタグから削除する")
		Routing(DELETE("/self/:tag"))
		Params(func() {
			Param("tag", String, "タグ")
			Required("tag")
		})
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
})
