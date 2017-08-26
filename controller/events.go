package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/goadesign/goa"
)

// EventsController implements the events resource.
type EventsController struct {
	*goa.Controller
}

// NewEventsController creates a events controller.
func NewEventsController(service *goa.Service) *EventsController {
	return &EventsController{Controller: service.NewController("EventsController")}
}

// List runs the list action.
func (c *EventsController) List(ctx *app.ListEventsContext) error {
	// EventsController_List: start_implement

	// Put your logic here

	// EventsController_List: end_implement
	res := app.EventsCollection{}
	return ctx.OK(res)
}

// Show runs the show action.
func (c *EventsController) Show(ctx *app.ShowEventsContext) error {
	// EventsController_Show: start_implement

	// Put your logic here

	// EventsController_Show: end_implement
	res := &app.EventsShow{}
	return ctx.OKShow(res)
}
