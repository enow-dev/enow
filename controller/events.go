package controller

import (
	"cloud.google.com/go/datastore"
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/model"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"google.golang.org/appengine"
	"google.golang.org/appengine/search"
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
	appCtx := appengine.NewContext(ctx.Request)
	index, err := search.Open("events")
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	options := search.SearchOptions{
		Limit:  10,
		Cursor: search.Cursor(ctx.Cursor),
	}
	events := app.EventTinyCollection{}
	iterator := index.Search(appCtx, ctx.Q, &options)
	for {
		var event model.SearchEvents
		_, err := iterator.Next(&event)
		if err == search.Done {
			break
		} else if err != nil {
			return ctx.InternalServerError(goa.ErrInternal(err))
		}

		events = append(events, event.SearchEventToEventTiny())
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
	eDB := model.EventsDB{}
	int64ID, err := util.ConvertIDIntoInt64(ctx.ID)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	appCtx := appengine.NewContext(ctx.Request)
	e, err := eDB.Get(appCtx, int64ID)
	if err == datastore.ErrNoSuchEntity {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.BadRequest(goa.ErrBadRequest(err))
	}

	// EventsController_Show: end_implement
	return ctx.OKShow(e.EventToEventShow())
}
