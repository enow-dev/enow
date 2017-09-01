package media

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

//---------------------------------------------
// SessionMedia　セッション情報(トークン含む)
//---------------------------------------------

var Session = MediaType("application/vnd.session+json", func() {
	Description("セッション情報")
	Attributes(func() {
		Attribute("token", String, "トークン", func() {
			Example("ECB666D778725EC97307044D642BF4D160AABB76F56C0069C71EA25B1E926825")
		})
		Attribute("expire", DateTime, "トークン期限", func() {
			Example("2017-08-26T15:05:11.916011956Z")
		})
		Attribute("name", String, "ユーザー名", func() {
			Example("hogeさん")
		})
		Required("token", "expire", "name")
	})
	View("default", func() {
		Attribute("token")
		Attribute("name")
		Attribute("expire")
	})
})
