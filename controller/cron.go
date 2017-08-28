package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/goadesign/goa"
)

// CronController implements the cron resource.
type CronController struct {
	*goa.Controller
}

// NewCronController creates a cron controller.
func NewCronController(service *goa.Service) *CronController {
	return &CronController{Controller: service.NewController("CronController")}
}

// FetchEvents runs the fetchEvents action.
func (c *CronController) FetchEvents(ctx *app.FetchEventsCronContext) error {
	// CronController_FetchEvents: start_implement

	// Put your logic here

	// CronController_FetchEvents: end_implement
	return nil
}

// ReadFix runs the readFix action.
func (c *CronController) ReadFix(ctx *app.ReadFixCronContext) error {
	// CronController_ReadFix: start_implement

	// Put your logic here

	// CronController_ReadFix: end_implement
	return nil
}
