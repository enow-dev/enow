package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = API("goa-spa", func() {
	Title("Sample")
	Description("Sample")
	Host("localhost:8080")
	Scheme("http", "https")
	BasePath("/")
})

var _ = Resource("swagger", func() {
	Files("/swagger/*filepath", "../public/swagger/")
})

var _ = Resource("front", func() {
	Files("/favicon.ico", "front/build/favicon.ico")
	Files("/static/*filepath", "front/build/static")
	Files("/manifest.json", "front/build/manifest.json")
	Files("*", "front/build/index.html")
})
