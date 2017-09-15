package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("tags", func() {
	BasePath("/api/tags")
	DefaultMedia(media.Event)
	Action("update", func() {
		Description("お気に入りに追加する（追加した時点で出さないようにする）")
		Routing(PUT("/:id/favorites"))
		Params(func() {
			Param("id")
			Required("id")
		})
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
	Action("delete", func() {
		Description("お気に入りから削除する")
		Routing(DELETE("/:id/favorites"))
		Params(func() {
			Param("id")
			Required("id")
		})
		Response(OK)
		UseTrait(GeneralUserTrait)
	})
})
