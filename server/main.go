//go:generate goagen bootstrap -d github.com/pei0804/goa-spa-sample/design

package server

import (
	"net/http"

	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/controller"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware"
)

func init() {
	// Create service
	service := goa.New("enow")

	// Mount middleware
	service.Use(middleware.RequestID())
	service.Use(middleware.LogRequest(true))
	service.Use(middleware.ErrorHandler(service, true))
	service.Use(middleware.Recover())

	// Mount "events" controller
	c := controller.NewEventsController(service)
	app.MountEventsController(service, c)
	// Mount "favorites" controller
	c2 := controller.NewFavoritesController(service)
	app.MountFavoritesController(service, c2)
	// Mount "front" controller
	c3 := controller.NewFrontController(service)
	app.MountFrontController(service, c3)
	// Mount "swagger" controller
	c4 := controller.NewSwaggerController(service)
	app.MountSwaggerController(service, c4)
	// Mount "swaggerui" controller
	c5 := controller.NewSwaggeruiController(service)
	app.MountSwaggeruiController(service, c5)

	// Start service
	http.HandleFunc("/", service.Mux.ServeHTTP)

}
