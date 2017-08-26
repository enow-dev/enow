package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("events", func() {
	BasePath("/api/events")
	DefaultMedia(media.Events)
	Action("list", func() {
		Description("list")
		Routing(GET(""))
		Params(func() {
			// ページング
			Param("q", String, "検索キーワード", func() {
				Default("")
			})
			Param("isFavorite", Boolean, "お気に入り済みのものも出す", func() {
				Default(false)
			})
			Param("isRed", Boolean, "閲覧済みのものを出さない", func() {
				Default(false)
			})
		})
		Response(OK, CollectionOf(media.Events, func() {
			View("default")
			View("tiny")
		}))
		UseTrait(GeneralUserTrait)
	})
	Action("show", func() {
		Description("show")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Any, "id(Int64 or String)")
			Required("id")
		})
		Response(OK, func() {
			Media(media.Events, "show")
		})
		UseTrait(GeneralUserTrait)
	})
})
