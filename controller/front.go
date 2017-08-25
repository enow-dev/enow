package controller

import (
	"github.com/goadesign/goa"
)

// FrontController implements the front resource.
type FrontController struct {
	*goa.Controller
}

// NewFrontController creates a front controller.
func NewFrontController(service *goa.Service) *FrontController {
	return &FrontController{Controller: service.NewController("FrontController")}
}
