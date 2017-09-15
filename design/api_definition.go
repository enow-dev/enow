package design

import (
	"os"

	. "github.com/enow-dev/enow/design/constant"
	_ "github.com/enow-dev/enow/design/resource"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = API("enow", func() {
	Title("enow")
	Description("enow")
	Host(func() string {
		switch os.Getenv("Op") {
		case "develop":
			return "localhost:8080"
		case "staging":
			return "enow-staging.appspot.com"
		case "production":
			return "enow.appspot.com"
		}
		return "localhost:8080"
	}())
	Scheme(func() string {
		switch os.Getenv("Op") {
		case "develop":
			return "http"
		case "staging":
			return "https"
		case "production":
			return "https"
		}
		return "http"
	}())
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
	Trait(GuestUserTrait, func() {
		Security(GuestAuth)
		Response(Unauthorized, ErrorMedia)
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError, ErrorMedia)
	})
	Trait(PaginatorHeaderTrait, func() {
		Header("x-search-hits-count")
		Header("link")
		Required("x-search-hits-count", "link")
	})
	Trait(PaginatorHeaderTrait2, func() {
		Header("link")
		Required("link")
	})
	Trait(GAECronTrait, func() {
		Security(GAECronAuth)
		Response(OK)
		Response(Unauthorized, ErrorMedia)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError, ErrorMedia)
	})
})

var _ = Resource("swaggerui", func() {
	Origin("*", func() {
		Methods("GET")
	})
	Files("/swaggerui/*filepath", "swaggerui/")
})

var _ = Resource("swagger", func() {
	Files("/swagger.json", "swagger/swagger.json")
})

var _ = Resource("front", func() {
	Files("/favicon.ico", "build/favicon.ico")
	Files("/static/js/*filepath", "build/static/js")
	Files("/static/media/*filepath", "build/static/media")
	Files("/service-worker.js", "build/service-worker.js")
	Files("/manifest.json", "build/manifest.json")
	Files("/asset-manifest.json", "build/asset-manifest.json")
	Files("/reset.css", "build/reset.css")
	Files("/index.css", "build/index.css")
	Files("*", "build")
	Files("/", "build/index.html")
})
