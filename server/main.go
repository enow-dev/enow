//go:generate goagen bootstrap -d github.com/pei0804/goa-spa-sample/design

package server

import (
	"net/http"

	"github.com/elazarl/go-bindata-assetfs"
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/controller"
	"github.com/enow-dev/enow/front"
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

	// Mount "front" controller
	c := controller.NewFrontController(service)
	c.FileSystem = func(dir string) http.FileSystem {
		return &assetfs.AssetFS{
			Asset:     front.Asset,
			AssetDir:  front.AssetDir,
			AssetInfo: front.AssetInfo,
			Prefix:    dir,
		}
	}
	app.MountFrontController(service, c)
	// Mount "swagger" controller
	c2 := controller.NewSwaggerController(service)
	app.MountSwaggerController(service, c2)

	// Start service
	http.HandleFunc("/", service.Mux.ServeHTTP)

}
