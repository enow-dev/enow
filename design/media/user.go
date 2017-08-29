package media

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var User = MediaType("application/vnd.user+json", func() {
	Description("user")
	Attributes(func() {
		Attribute("id", String, "id", func() {
			Example("9223372036854775807")
		})
		Attribute("name", String, "ユーザー名")
		Required(
			"id",
			"name",
		)
	})
	View("default", func() {
		Attribute("id")
		Attribute("name")
		Required(
			"id",
			"name",
		)
	})
	View("full", func() {
		Attribute("id")
		Attribute("name")
		Required(
			"id",
			"name",
		)
	})
})
