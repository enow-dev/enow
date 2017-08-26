package media

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var Users = MediaType("application/vnd.users+json", func() {
	Description("events")
	Attributes(func() {
		Attribute("id", Any, "id", func() {
			Example(9223372036854775807)
		})
		Attribute("id_str", String, "id(string)", func() {
			Example("9223372036854775807")
		})
		Attribute("name", String, "ユーザー名")
	})
	View("default", func() {
		Attribute("id")
		Attribute("id_str")
		Attribute("name")
		Required(
			"id",
			"id_str",
			"name",
		)
	})
})
