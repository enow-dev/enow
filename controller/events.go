package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/mock"
	"github.com/enow-dev/enow/util"
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
// TODO: 詳しいロジックを実装したら消す
// nolint
func (c *EventsController) List(ctx *app.ListEventsContext) error {
	// EventsController_List: start_implement

	// Put your logic here
	events := app.EventTinyCollection{}
	event := app.EventTiny{}
	mEvent := mock.CreateEventMedia()
	for i := 0; i < 10; i++ {
		util.CopyStruct(mEvent, &event)
		events = append(events, &event)
	}

	// EventsController_List: end_implement
	return ctx.OKTiny(events)
}

// Show runs the show action.
// TODO: 詳しいロジックを実装したら消す
// nolint
func (c *EventsController) Show(ctx *app.ShowEventsContext) error {
	// EventsController_Show: start_implement

	// Put your logic here
	event := app.EventShow{}
	mEvent := mock.CreateEventMedia()
	util.CopyStruct(mEvent, &event)

	// EventsController_Show: end_implement
	return ctx.OKShow(&event)
}
