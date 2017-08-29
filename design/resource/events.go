package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("events", func() {
	BasePath("/api/events")
	DefaultMedia(media.Event)
	Action("list", func() {
		Description("list")
		Routing(GET(""))
		Params(func() {
			// ページング
			Param("q", String, "検索キーワード", func() {
				Default("")
			})
			Param("is_favorite", Boolean, "お気に入り済みのものも出す", func() {
				Default(false)
			})
			Param("is_red", Boolean, "閲覧済みのものを出さない", func() {
				Default(false)
			})
			Param("cursor", String, "ページングカーソル", func() {
				Default("")
			})
		})
		Response(OK, CollectionOf(media.Event, func() {
			View("default")
			View("tiny")
		}))
		UseTrait(GeneralUserTrait)
	})
	Action("show", func() {
		Description("show")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", String, "id")
			Required("id")
		})
		Response(OK, func() {
			Media(media.Event, "show")
		})
		UseTrait(GeneralUserTrait)
	})
})
