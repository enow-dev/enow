package resource

import (
	. "github.com/enow-dev/enow/design/constant"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("cron", func() {
	BasePath("/cron")
	Action("fetchEvents", func() {
		Description("fetchEvents")
		Routing(GET("/fetchEvents"))
		UseTrait(GAECronTrait)
	})
	Action("readFix", func() {
		Description("readFix")
		Routing(GET("readFix"))
		UseTrait(GAECronTrait)
	})
})
