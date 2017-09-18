package controller

import (
	"os"

	"time"

	"fmt"

	"cloud.google.com/go/datastore"
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/design/constant"
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

const errTypeEvents = "events"

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
		log.Errorf(appCtx, "%s index取得エラー(1): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 1)))
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
		log.Errorf(appCtx, "%s index runエラー(2): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 2)))
	}
	events := app.EventTinyCollection{}
	for {
		var event model.SearchEvents
		_, err := iterator.Next(&event)
		if err == search.Done {
			break
		} else if err != nil {
			log.Errorf(appCtx, "%s iteratorエラー(3): %v", errTypeEvents, err)
			return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 3)))
		}
		et := event.SearchEventToEventTiny()
		int64EventID, err := util.ConvertIDIntoInt64(event.ID)
		if err != nil {
			log.Errorf(appCtx, "%s イベントID取得エラー(4): %v", errTypeEvents, err)
		}
		if userKey != nil {
			// 既読状態を判定する
			uerDB := model.UserEventReadsDB{}
			isRed, err := uerDB.IsRedEvent(appCtx, int64EventID, userKey.IntID())
			if err != nil {
				log.Errorf(appCtx, "%s 既読イベント取得エラー(5): %v", errTypeEvents, err)
			}
			et.IsRed = isRed
			// お気に入り状態を判定する
			uefDB := model.UserEventFavoritesDB{}
			isFavorite, err := uefDB.IsFavoriteEvent(appCtx, int64EventID, userKey)
			if err != nil {
				log.Errorf(appCtx, "%s お気に入り判定エラー(5): %v", errTypeEvents, err)
			}
			et.IsFavorite = isFavorite
		}
		// お気に入り状態を判定する
		events = append(events, et)

		// 既読情報をつける
		if userKey != nil {
			eventID, err := util.ConvertIDIntoInt64(event.ID)
			if err != nil {
				log.Errorf(appCtx, "%s 既読情報挿入エラー(5): %v", errTypeEvents, err)
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
	l := util.CreateLinkHeader(ctx.RequestData, os.Getenv("Scheme"), fmt.Sprint(iterator.Cursor()))
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
		log.Errorf(appCtx, "%s ID取得エラー(6): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 6)))
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
			log.Errorf(appCtx, "%s 既読情報取得エラー(7): %v", errTypeEvents, err)
			return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 7)))
		}
		es.IsRed = isRed
		// お気に入り状態を判定する
		uefDB := model.UserEventFavoritesDB{}
		isFavorite, err := uefDB.IsFavoriteEvent(appCtx, int64ID, userKey)
		if err != nil {
			log.Errorf(appCtx, "%s お気に入り情報取得エラー(8): %v", errTypeEvents, err)
			return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 8)))
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
		log.Errorf(appCtx, "%s index取得エラー(9): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 9)))
	}
	se := model.NewSearchEventsDB(indexName)
	se.SetPref(appCtx, ctx.Pref)
	se.SetLimit(appCtx, 1)
	se.SetNotSearchID(appCtx, userKey)
	se.SetSearchKeyword(appCtx, ctx.Q)
	iterator, err := se.Run(appCtx)
	if err != nil {
		log.Errorf(appCtx, "%s index読み込みエラー(10): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 10)))
	}
	events := app.EventTinyCollection{}
	for {
		var event model.SearchEvents
		_, err := iterator.Next(&event)
		if err == search.Done {
			break
		} else if err != nil {
			log.Errorf(appCtx, "%s iteratorエラー(11): %v", errTypeEvents, err)
			return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 11)))
		}
		events = append(events, event.SearchEventToEventTiny())
	}
	// EventsController_ShowCount: end_implement
	return ctx.OK(iterator.Count())
	//return ctx.OK(iterator.Count())
}

// SelfFavoriteList runs the selfFavoriteList action.
func (c *EventsController) SelfFavoriteList(ctx *app.SelfFavoriteListEventsContext) error {
	// EventsController_SelfFavoriteList: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		log.Errorf(appCtx, "%s UserKey取得エラー(12): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 12)))
	}
	ufeDB := &model.UserEventFavoritesDB{}
	events, cursor, err := ufeDB.GetListFindByUserKey(appCtx, userKey, ctx.Cursor)
	if err != nil {
		log.Errorf(appCtx, "%s ユーザーのお気に入り情報取得エラー(13): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 13)))
	}
	l := util.CreateLinkHeader(ctx.RequestData, os.Getenv("Scheme"), fmt.Sprint(cursor))
	ctx.ResponseData.Header().Set("link", l.String())

	// EventsController_SelfFavoriteList: end_implement
	return ctx.OKTiny(events)
}

// DeleteFavorite runs the deleteFavorite action.
func (c *EventsController) DeleteFavorite(ctx *app.DeleteFavoriteEventsContext) error {
	// EventsController_DeleteFavorite: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		log.Errorf(appCtx, "%s UserKey取得エラー(14): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 14)))
	}
	int64ID, err := util.ConvertIDIntoInt64(ctx.ID)
	if err != nil {
		log.Errorf(appCtx, "%s ID変換取得エラー(15): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 15)))
	}
	ufeDB := &model.UserEventFavoritesDB{}
	err = ufeDB.Delete(appCtx, int64ID, userKey)
	if err != nil {
		log.Errorf(appCtx, "%s お気に入り削除エラー(16): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 16)))
	}

	// EventsController_DeleteFavorite: end_implement
	return nil
}

// UpdateFavorite runs the updateFavorite action.
func (c *EventsController) UpdateFavorite(ctx *app.UpdateFavoriteEventsContext) error {
	// EventsController_UpdateFavorite: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		log.Errorf(appCtx, "%s UserKey取得エラー(15): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 15)))
	}
	int64ID, err := util.ConvertIDIntoInt64(ctx.ID)
	if err != nil {
		log.Errorf(appCtx, "%s ID変換取得エラー(16): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 16)))
	}
	ufeDB := &model.UserEventFavoritesDB{}
	now := time.Now()
	err = ufeDB.Add(appCtx, int64ID, userKey, now)
	if err != nil && err.Error() == fmt.Errorf("存在しないイベントIDが指定されています").Error() {
		log.Errorf(appCtx, "%s 存在しないイベントのお気に入り追加エラー(17): %v", errTypeEvents, err)
		return ctx.BadRequest(goa.ErrBadRequest(fmt.Errorf(constant.BadRequestErr, errTypeEvents, 17)))
	} else if err != nil {
		log.Errorf(appCtx, "%s お気に入り追加エラー(18): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeEvents, 18)))
	}

	// EventsController_UpdateFavorite: end_implement
	return nil
}
