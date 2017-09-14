package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("cron", func() {
	BasePath("/api/cron")
	Action("fetchEvents", func() {
		Description("イベント情報を取得する")
		Routing(GET("/fetch_events"))
		UseTrait(GAECronTrait)
	})
	Action("readFix", func() {
		Description("既読情報を確定する")
		Routing(GET("/read_fix"))
		UseTrait(GAECronTrait)
	})
	Action("upgradeTags", func() {
		Description("タグを更新する")
		Routing(GET("/upgrade_tags"))
		UseTrait(GAECronTrait)
	})
	Action("sendRecommendMail", func() {
		Description("レコメンドメールを送信する")
		Routing(GET("/send_recommend_mail"))
		UseTrait(GAECronTrait)
	})
})
