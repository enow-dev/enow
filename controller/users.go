package controller

import (
	"fmt"

	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/model"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

const errTypeUsers = "users"

// UsersController implements the users resource.
type UsersController struct {
	*goa.Controller
}

// NewUsersController creates a users controller.
func NewUsersController(service *goa.Service) *UsersController {
	return &UsersController{Controller: service.NewController("UsersController")}
}

// Delete runs the delete action.
func (c *UsersController) Delete(ctx *app.DeleteUsersContext) error {
	// UsersController_Delete: start_implement

	// Put your logic here

	// UsersController_Delete: end_implement
	res := &app.User{}
	return ctx.OK(res)
}

// Show runs the show action.
func (c *UsersController) Show(ctx *app.ShowUsersContext) error {
	// UsersController_Show: start_implement

	// Put your logic here

	// UsersController_Show: end_implement
	res := &app.User{}
	return ctx.OK(res)
}

// Update runs the update action.
func (c *UsersController) Update(ctx *app.UpdateUsersContext) error {
	// UsersController_Update: start_implement

	// Put your logic here

	// UsersController_Update: end_implement
	res := &app.User{}
	return ctx.OK(res)
}

// DeleteTag runs the deleteTag action.
func (c *UsersController) DeleteTag(ctx *app.DeleteTagUsersContext) error {
	// UsersController_DeleteTag: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		log.Errorf(appCtx, "%s UserKey取得エラー(1): %v", errTypeUsers, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeUsers, 1)))
	}
	uDB := model.UsersDB{}
	err = uDB.DeleteFavoriteTag(appCtx, ctx.Tag, userKey)
	if err != nil {
		log.Errorf(appCtx, "%s お気に入りタグ追加エラー(2): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeUsers, 2)))
	}

	// UsersController_DeleteTag: end_implement
	return nil
}

// UpdateTag runs the updateTag action.
func (c *UsersController) UpdateTag(ctx *app.UpdateTagUsersContext) error {
	// UsersController_UpdateTag: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	userKey, err := util.GetUserKey(ctx)
	if err != nil {
		log.Errorf(appCtx, "%s UserKey取得エラー(3): %v", errTypeUsers, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeUsers, 3)))
	}
	// 追加したいタグが存在しない時はエラーとする
	uDB := model.UsersDB{}
	err = uDB.AddFavoriteTag(appCtx, ctx.Tag, userKey)
	if err != nil && err.Error() == fmt.Errorf("存在しないタグが指定されています").Error() {
		log.Errorf(appCtx, "%s お気に入りタグ追加エラー(4): %v", errTypeEvents, err)
		return ctx.BadRequest(goa.ErrBadRequest(fmt.Errorf(constant.BadRequestErr, errTypeUsers, 4)))
	} else if err != nil {
		log.Errorf(appCtx, "%s お気に入りタグ追加エラー(5): %v", errTypeEvents, err)
		return ctx.InternalServerError(goa.ErrInternal(fmt.Errorf(constant.InternalErr, errTypeUsers, 5)))
	}

	// UsersController_UpdateTag: end_implement
	return nil
}
