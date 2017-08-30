package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/design/media"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("favorites", func() {
	BasePath("/api/events")
	DefaultMedia(media.Event)
	Action("selfList", func() {
		Description("ユーザーのお気に入り情報を返す（ユーザー判別はtokenで行う）")
		Routing(GET("self/favorites"))
		Params(func() {
			Param("isEnd", Boolean, "終了したイベントを取得する", func() {
				Default(false)
			})
			Required("isEnd")
		})
		Response(OK, CollectionOf(media.Event, func() {
			View("default")
			View("tiny")
		}))
		UseTrait(GeneralUserTrait)
	})
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
