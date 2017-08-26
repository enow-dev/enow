package design

import (
	. "github.com/enow-dev/enow/design/constant"
	_ "github.com/enow-dev/enow/design/resource"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = API("enow", func() {
	Title("enow")
	Description("enow")
	Host("localhost:8080")
	Scheme("http", "https")
	BasePath("/")
	Trait(AdminUserTrait, func() {
		Security(AdminAuth)
		Response(Unauthorized, ErrorMedia)
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError, ErrorMedia)
	})
	Trait(GeneralUserTrait, func() {
		Security(GeneralAuth)
		Response(Unauthorized, ErrorMedia)
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError, ErrorMedia)
	})
	Trait(PaginatorHeader, func() {
		Header("x-search-hits-count")
		Header("link")
		Required("x-search-hits-count", "link")
	})
})

var _ = Resource("swagger", func() {
	Origin("*", func() {
		Methods("GET")
	})
	Files("/swagger.json", "../swagger/swagger.json")
	Files("/swagger/*filepath", "../swaggerui/")
})

var _ = Resource("front", func() {
	Files("*", "front/build/")
	Files("/", "front/build/index.html")
})
