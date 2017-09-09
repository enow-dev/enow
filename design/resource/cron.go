package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("cron", func() {
	BasePath("/api/cron")
	Action("fetchEvents", func() {
		Description("fetch events")
		Routing(GET("/fetch_events"))
		UseTrait(GAECronTrait)
	})
	Action("readFix", func() {
		Description("readFix")
		Routing(GET("/read_fix"))
		UseTrait(GAECronTrait)
	})
	Action("upgradeTags", func() {
		Description("upgradeTags")
		Routing(GET("/upgrade_tags"))
		UseTrait(GAECronTrait)
	})
})
