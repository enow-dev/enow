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
			Param("pref", Integer, "都道府県検索", func() {
				Default(0)
			})
			Param("is_red", Boolean, "閲覧済みのものを出さない", func() {
				Default(false)
			})
			Param("cursor", String, "ページングカーソル", func() {
				Default("")
			})
		})
		Response(OK, func() {
			Media(CollectionOf(media.Event, func() {
				View("default")
				View("tiny")
			}))
			Headers(func() {
				UseTrait(PaginatorHeaderTrait)
			})
		})
		UseTrait(GuestUserTrait)
	})
	Action("show", func() {
		Description("show")
		Routing(GET("/:id"))
		Params(func() {
			Param("id")
			Required("id")
		})
		Response(OK, func() {
			Media(media.Event, "show")
		})
		UseTrait(GuestUserTrait)
	})
	Action("showCount", func() {
		Description("showCount")
		Routing(GET("/count"))
		Params(func() {
			Param("q", String, "検索キーワード", func() {
				Default("")
			})
			Param("pref", Integer, "都道府県検索", func() {
				Default(0)
			})
		})
		Response(OK, Integer)
		UseTrait(GuestUserTrait)
	})
})
