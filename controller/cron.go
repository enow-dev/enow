package controller

import (
	"os"
	"time"

	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/config"
	"github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/model"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"github.com/mjibson/goon"
	"google.golang.org/appengine"
	"google.golang.org/appengine/search"

	yaml "gopkg.in/yaml.v1"

	"fmt"
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
	//var cs config.APIConfigs
	var apis *config.APIs
	if os.Getenv("Op") == "develop" {
		conf, err := config.NewAPIConfigsFromFile("../config/api.yaml")
		if err != nil {
			goa.LogError(ctx, "err", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		apis, err = config.NewAPIsConf(conf)
		if err != nil {
			goa.LogError(ctx, "err", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	} else {
		appCtx := appengine.NewContext(ctx.Request)
		cs, err := util.ReadFileFromBucket(appCtx, "api.yaml")
		if err != nil {
			goa.LogError(ctx, "err", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		var conf config.APIConfigs
		if err = yaml.Unmarshal(cs, &conf); err != nil {
			goa.LogError(ctx, "err", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		apis, err = config.NewAPIsConf(conf)
		if err != nil {
			goa.LogError(ctx, "err", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	}

	// APIリクエスト投げる準備
	now := time.Now()
	atnd := make([]model.Parser, constant.SearchPeriod)
	connpass := make([]model.Parser, constant.SearchPeriod)
	doorKeeper := make([]model.Parser, constant.SearchPeriod)

	// それぞれのりリクエストを作成する
	for i := 0; i < constant.SearchPeriod; i++ {
		// ATND
		// 年月で検索範囲指定する
		ym := now.AddDate(0, i, 0).Format("200601")
		atnd[i].URL = fmt.Sprintf("%s&ym=%s", apis.ATND.URL, ym)
		atnd[i].APIType = constant.AtndID
		atnd[i].Token = apis.ATND.Token

		// Connpass
		// 年月で検索範囲指定する
		connpass[i].URL = fmt.Sprintf("%s&ym=%s", apis.Connpass.URL, ym)
		connpass[i].APIType = constant.ConnpassID
		connpass[i].Token = apis.Connpass.Token

		// Doorkeeper
		// pageで検索範囲指定する
		doorKeeper[i].URL = fmt.Sprintf("%s?page=%d", apis.Doorkeeper.URL, i)
		doorKeeper[i].APIType = constant.DoorkeeperID
		doorKeeper[i].Token = apis.Doorkeeper.Token
	}
	allParser := make([]model.Parser, 0)
	allParser = append(allParser, atnd...)
	allParser = append(allParser, connpass...)
	allParser = append(allParser, doorKeeper...)

	// TODO: API提供元に負荷がかかるので、順次処理にしている。
	index, err := search.Open("events")
	if err != nil {
		goa.LogError(ctx, "err", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	g := goon.NewGoon(ctx.Request)
	appCtx := appengine.NewContext(ctx.Request)
	for _, p := range allParser {
		cli := model.NewParser(p.URL, p.APIType, p.Token, ctx.Request)
		es, err := cli.ConvertingToJSON()
		if err != nil {
			goa.LogError(ctx, "error", "error", err)
		}
		//goa.LogInfo(ctx, "es", es)
		for _, v := range es {
			// 存在しなければcreated_atを入れる
			v.CreatedAt = time.Now()
			key, err := g.Put(&v)
			if err != nil {
				goa.LogError(ctx, "error", "err", err)
			}
			s := model.SearchEvents{}
			util.CopyStruct(v, &s)
			s.ID = fmt.Sprintf("%d", key.IntID())
			s.Description = search.HTML(v.Description)
			s.Limit = fmt.Sprintf("%d", v.Limit)
			s.Accepted = fmt.Sprintf("%d", v.Accepted)
			s.Waiting = fmt.Sprintf("%d", v.Waiting)
			s.Pref = fmt.Sprintf("%d", v.Pref)
			s.APIID = fmt.Sprintf("%d", v.APIID)
			_, err = index.Put(appCtx, key.StringID(), &s)
			if err != nil {
				goa.LogError(ctx, "err", err)
				return ctx.InternalServerError(goa.ErrInternal(err))
			}
			//goa.LogInfo(ctx, "st", st)
		}

		//for _, e := range es {
		//	events := &model.Events{}
		//	events.APIID = e.APIType
		//	events.Title = e.Title
		//	events.Address = e.Address
		//	events.Accept = e.Accept
		//	events.Identifier = e.Identifier
		//	events.DataHash = e.DataHash
		//	events.Description = e.Description
		//	events.Limits = e.Limits
		//	events.Pref = e.Pref
		//	events.URL = e.URL
		//	events.Wait = e.Wait
		//	events.StartAt = e.StartAt
		//	events.EndAt = e.EndAt
		//	events.PrefID = utility.ConvertIdFromAddress(e.Address)
		//	eventsDB := models.NewEventDB(c.db)
		//	err = eventsDB.AddOrUpdate(ctx, events)
		//	if err != nil {
		//		goa.LogError(ctx, "event AddOrUpdate error", "error", err.Error())
		//	}
		//}
	}

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
