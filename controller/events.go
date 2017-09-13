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
	now := time.Now()
	// 未ログインでも許容する
	userKey, _ := util.GetUserKey(ctx)
	sel := model.SearchEventsLogDB{}
	indexName, err := sel.GetLatestVersion(appCtx)
	if err != nil {
		log.Errorf(appCtx, "index not found err=%v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	se := model.NewSearchEventsDB(indexName)
	se.SetLimit(appCtx, 20)
	se.Sort(appCtx, "StartAt", ctx.StartAtSort)
	// 日付指定が一切されていない時は開催終了前のものだけを出す
	if ctx.PeriodFrom == "" && ctx.PeriodTo == "" {
		se.SetPeriodDate(appCtx, "EndAt >=", now)
	} else {
		se.SetPeriodDate(appCtx, "EndAt >=", ctx.PeriodFrom)
		se.SetPeriodDate(appCtx, "EndAt <=", ctx.PeriodTo)
	}

	se.SetPref(appCtx, ctx.Pref)
	se.SetCursor(appCtx, ctx.Cursor)
	// 既読しているイベントも出す
	if !ctx.IsRed {
		se.SetNotSearchID(appCtx, userKey)
	}
	se.SetSearchKeyword(appCtx, ctx.Q)
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
		et := event.SearchEventToEventTiny()
		int64EventID, err := util.ConvertIDIntoInt64(event.ID)
		if err != nil {
			log.Errorf(appCtx, "既読済み確認時エラー(1) %v", err)
		}
		if userKey != nil {
			// 既読状態を判定する
			uerDB := model.UserEventReadsDB{}
			isRed, err := uerDB.IsRedEvent(appCtx, int64EventID, userKey.IntID())
			if err != nil {
				log.Errorf(appCtx, "既読済み確認時エラー(2) %v", err)
			}
			et.IsRed = isRed
			// お気に入り状態を判定する
			uefDB := model.UserEventFavoritesDB{}
			isFavorite, err := uefDB.IsFavoriteEvent(appCtx, int64EventID, userKey)
			if err != nil {
				log.Errorf(appCtx, "お気に入り済み確認時エラー(3) %v", err)
			}
			et.IsFavorite = isFavorite
		}
		// お気に入り状態を判定する
		events = append(events, et)

		// 既読情報をつける
		if userKey != nil {
			eventID, err := util.ConvertIDIntoInt64(event.ID)
			if err != nil {
				log.Errorf(appCtx, "既読情報の挿入時エラー(4) %v", err)
			}
			userEventReads := &model.UserEventReads{
				EventID:    eventID,
				EventEndAt: event.EndAt,
				UserID:     userKey.IntID(),
				CreatedAt:  now,
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
func (c *EventsController) Show(ctx *app.ShowEventsContext) error {
	// EventsController_Show: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	int64ID, err := util.ConvertIDIntoInt64(ctx.ID)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	eDB := model.EventsDB{}
	e, err := eDB.Get(appCtx, int64ID)
	if err == datastore.ErrNoSuchEntity {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.BadRequest(goa.ErrBadRequest(err))
	}
	es := e.EventToEventShow()
	// ユーザーがログインしている場合既読情報やお気に入り情報を確認する
	userKey, _ := util.GetUserKey(ctx)
	if userKey != nil {
		// 既読状態を判定する
		uerDB := model.UserEventReadsDB{}
		isRed, err := uerDB.IsRedEvent(appCtx, int64ID, userKey.IntID())
		if err != nil {
			log.Errorf(appCtx, "既読済み確認時エラー(2) %v", err)
		}
		es.IsRed = isRed
		// お気に入り状態を判定する
		uefDB := model.UserEventFavoritesDB{}
		isFavorite, err := uefDB.IsFavoriteEvent(appCtx, int64ID, userKey)
		if err != nil {
			log.Errorf(appCtx, "お気に入り済み確認時エラー(3) %v", err)
		}
		es.IsFavorite = isFavorite
	}
	// EventsController_Show: end_implement
	return ctx.OKShow(e.EventToEventShow())
}

// ShowCount runs the showCount action.
func (c *EventsController) ShowCount(ctx *app.ShowCountEventsContext) error {
	// EventsController_ShowCount: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	// 未ログインでも許容する
	userKey, _ := util.GetUserKey(ctx)
	sel := model.SearchEventsLogDB{}
	indexName, err := sel.GetLatestVersion(appCtx)
	if err != nil {
		log.Errorf(appCtx, "index not found err=%v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	se := model.NewSearchEventsDB(indexName)
	se.SetPref(appCtx, ctx.Pref)
	se.SetLimit(appCtx, 1)
	se.SetNotSearchID(appCtx, userKey)
	se.SetSearchKeyword(appCtx, ctx.Q)
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
	// EventsController_ShowCount: end_implement
	return ctx.OK(iterator.Count())
	//return ctx.OK(iterator.Count())
}
