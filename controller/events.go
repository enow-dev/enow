package controller

import (
	"os"

	"time"

	"fmt"

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
	se.SetPref(ctx.Pref)
	se.SetCursor(ctx.Cursor)
	se.SetNotSearchID("")
	se.SetSearchKeyword(ctx.Q)
	iterator, err := se.Run(appCtx)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		log.Errorf(appCtx, "ログインユーザー取得時にエラー %v", err)
	}
	events := app.EventTinyCollection{}
	now := time.Now()
	for {
		var event model.SearchEvents
		_, err := iterator.Next(&event)
		if err == search.Done {
			break
		} else if err != nil {
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		events = append(events, event.SearchEventToEventTiny())

		// 既読情報をつける
		if userKey != nil {
			eventID, err := util.ConvertIDIntoInt64(event.ID)
			if err != nil {
				log.Infof(appCtx, "既読情報の挿入時エラー(1) %v", err)
			}
			userEventReads := &model.UserEventReads{
				EventID:   eventID,
				UserID:    userKey.IntID(),
				CreatedAt: now,
			}
			uerDB := model.UserEventReadsDB{}
			uerDB.Add(appCtx, userEventReads)
		}
	}
	l := util.CreateLinkHeader(ctx.RequestData, os.Getenv("Scheme"), iterator.Cursor())
	ctx.ResponseData.Header().Set("link", l.String())
	ctx.ResponseData.Header().Set("x-search-hits-count", fmt.Sprint(iterator.Count()))

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

// ShowCount runs the showCount action.
func (c *EventsController) ShowCount(ctx *app.ShowCountEventsContext) error {
	// EventsController_ShowCount: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	sel := model.SearchEventsLogDB{}
	indexName, err := sel.GetLatestVersion(appCtx, time.Now())
	if err != nil {
		log.Errorf(appCtx, "index not found err=%v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	se := model.NewSearchEventsDB(indexName)
	se.SetPref(ctx.Pref)
	se.SetNotSearchID("")
	se.SetSearchKeyword(ctx.Q)
	iterator, err := se.Run(appCtx)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	var event model.SearchEvents
	_, err = iterator.Next(&event)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	// EventsController_ShowCount: end_implement
	return ctx.OK(iterator.Count())
}
