//go:generate goagen bootstrap -d github.com/pei0804/goa-spa-sample/design

package server

import (
	"net/http"
	"os"

	"github.com/deadcheat/goacors"
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/controller"
	"github.com/enow-dev/enow/design"
	"github.com/enow-dev/enow/mymiddleware"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware"
)

// Server 実行に必要な値を保持している
type Server struct {
	service *goa.Service
}

// NewServer Server構造体を作成する
func NewServer(s *goa.Service) *Server {
	return &Server{
		service: s,
	}
}

func (s *Server) mountController() {
	// Mount "auth" controller
	auth := controller.NewAuthController(s.service)
	app.MountAuthController(s.service, auth)
	// Mount "events" controller
	events := controller.NewEventsController(s.service)
	app.MountEventsController(s.service, events)
	// Mount "favorites" controller
	favorites := controller.NewFavoritesController(s.service)
	app.MountFavoritesController(s.service, favorites)
	// Mount "front" controller
	front := controller.NewFrontController(s.service)
	app.MountFrontController(s.service, front)
	// Mount "swagger" controller
	swagger := controller.NewSwaggerController(s.service)
	app.MountSwaggerController(s.service, swagger)
	// Mount "swaggerui" controller
	swaggerui := controller.NewSwaggeruiController(s.service)
	app.MountSwaggeruiController(s.service, swaggerui)
	// Mount "cron" controller
	cron := controller.NewCronController(s.service)
	app.MountCronController(s.service, cron)
}

func (s *Server) mountMiddleware() {
	s.service.Use(middleware.RequestID())
	s.service.Use(middleware.LogRequest(true))
	s.service.Use(middleware.ErrorHandler(s.service, true))
	s.service.Use(middleware.Recover())
	s.service.Use(goacors.WithConfig(s.service, design.CorsConfig[os.Getenv("Op")]))

	// dev.yamlのNoSecureの項目がtrueになっている時は、tokenの存在チェックのみにする（厳密な認証なし）
	app.UseGaeCronAuthMiddleware(s.service, mymiddleware.NewGAECronMiddleware())
	if os.Getenv("NoSecure") == "true" {
		app.UseAdminAuthMiddleware(s.service, mymiddleware.NewTestModeMiddleware())
		app.UseGeneralAuthMiddleware(s.service, mymiddleware.NewTestModeMiddleware())
	} else {
		app.UseAdminAuthMiddleware(s.service, mymiddleware.NewAdminUserAuthMiddleware())
		app.UseGeneralAuthMiddleware(s.service, mymiddleware.NewGeneralUserAuthMiddleware())
	}
}

func init() {
	service := goa.New("enow")
	s := NewServer(service)
	s.mountMiddleware()
	s.mountController()

	// Start service
	http.HandleFunc("/", service.Mux.ServeHTTP)

}
