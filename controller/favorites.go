package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/model"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"google.golang.org/appengine"
)

// FavoritesController implements the favorites resource.
type FavoritesController struct {
	*goa.Controller
}

// NewFavoritesController creates a favorites controller.
func NewFavoritesController(service *goa.Service) *FavoritesController {
	return &FavoritesController{Controller: service.NewController("FavoritesController")}
}

// Update runs the upsert action.
func (c *FavoritesController) Update(ctx *app.UpdateFavoritesContext) error {
	// FavoritesController_Update: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	int64ID, err := util.ConvertIDIntoInt64(ctx.ID)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	ufeDB := &model.UserEventFavoritesDB{}
	err = ufeDB.Add(appCtx, int64ID, userKey)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	// FavoritesController_Update: end_implement
	return nil
}

// Delete runs the delete action.
func (c *FavoritesController) Delete(ctx *app.DeleteFavoritesContext) error {
	// FavoritesController_Delete: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	int64ID, err := util.ConvertIDIntoInt64(ctx.ID)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	ufeDB := &model.UserEventFavoritesDB{}
	err = ufeDB.Delete(appCtx, int64ID, userKey)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	// FavoritesController_Delete: end_implement
	return nil
}

// SelfList runs the list action.
func (c *FavoritesController) SelfList(ctx *app.SelfListFavoritesContext) error {
	// FavoritesController_SelfList: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	ufeDB := &model.UserEventFavoritesDB{}
	events, err := ufeDB.GetListFindByUserKey(appCtx, userKey)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	// FavoritesController_SelfList: end_implement
	return ctx.OKTiny(events)
}
