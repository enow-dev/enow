package controller

import (
	"os"

	"time"

	"cloud.google.com/go/datastore"
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/model"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
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
	sel := model.SearchEventsLogDB{}
	indexName, err := sel.GetLatestVersion(appCtx, time.Now())
	if err != nil {
		log.Errorf(appCtx, "index not found err=%v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	se := model.NewSearchEventsDB(indexName)
	se.SetLimit(10)
	se.Sort("StartAt", false)
	se.SetPref(0)
	se.SetCursor(ctx.Cursor)
	se.SetNotSearchID("")
	se.SetSearchKeyword("")
	iterator, err := se.Run(appCtx)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	events := app.EventTinyCollection{}
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
	l := util.CreateLinkHeader(ctx.RequestData, os.Getenv("Scheme"), iterator.Cursor())
	ctx.ResponseData.Header().Set("link", l.String())

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
