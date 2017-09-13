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
			Param("start_at_sort", String, "開催日ソート（デフォルトは昇順）", func() {
				Enum("asc", "desc")
				Default("asc")
			})
			Param("period_from", String, "終了日付範囲指定（◯◯日から〜）Format: yyyy-mm-dd", func() {
				Pattern(`^\d{4}\-\d{2}\-\d{2}$`)
				Default("")
			})
			Param("period_to", String, "終了日付範囲指定（〜◯◯日まで）Format: yyyy-mm-dd", func() {
				Pattern(`^\d{4}\-\d{2}\-\d{2}$`)
				Default("")
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
