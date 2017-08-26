package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/goadesign/goa"
)

// FavoritesController implements the favorites resource.
type FavoritesController struct {
	*goa.Controller
}

// NewFavoritesController creates a favorites controller.
func NewFavoritesController(service *goa.Service) *FavoritesController {
	return &FavoritesController{Controller: service.NewController("FavoritesController")}
}

// Create runs the create action.
func (c *FavoritesController) Create(ctx *app.CreateFavoritesContext) error {
	// FavoritesController_Create: start_implement

	// Put your logic here

	// FavoritesController_Create: end_implement
	return nil
}

// Delete runs the delete action.
func (c *FavoritesController) Delete(ctx *app.DeleteFavoritesContext) error {
	// FavoritesController_Delete: start_implement

	// Put your logic here

	// FavoritesController_Delete: end_implement
	return nil
}

// List runs the list action.
func (c *FavoritesController) List(ctx *app.ListFavoritesContext) error {
	// FavoritesController_List: start_implement

	// Put your logic here

	// FavoritesController_List: end_implement
	res := app.EventsCollection{}
	return ctx.OK(res)
}
