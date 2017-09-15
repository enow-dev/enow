package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/goadesign/goa"
)

// TagsController implements the tags resource.
type TagsController struct {
	*goa.Controller
}

// NewTagsController creates a tags controller.
func NewTagsController(service *goa.Service) *TagsController {
	return &TagsController{Controller: service.NewController("TagsController")}
}

// Delete runs the delete action.
func (c *TagsController) Delete(ctx *app.DeleteTagsContext) error {
	// TagsController_Delete: start_implement

	// Put your logic here

	// TagsController_Delete: end_implement
	res := &app.Event{}
	return ctx.OK(res)
}

// Update runs the update action.
func (c *TagsController) Update(ctx *app.UpdateTagsContext) error {
	// TagsController_Update: start_implement

	// Put your logic here

	// TagsController_Update: end_implement
	res := &app.Event{}
	return ctx.OK(res)
}
