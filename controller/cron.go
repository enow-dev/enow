package controller

import (
	"fmt"
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
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/mail"
	"google.golang.org/appengine/search"
	yaml "gopkg.in/yaml.v1"
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
	// GAE上での動作の場合はCloudStorageの設定ファイルを使う
	// そうでない場合は、ローカルの設定ファイルを使う
	appCtx := appengine.NewContext(ctx.Request)
	var apis *config.APIs
	// TODO: 関数を別で作成する
	if os.Getenv("Op") == "develop" {
		conf, err := config.NewAPIConfigsFromFile("../config/api.yaml")
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(1): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		apis, err = config.NewAPIsConf(conf)
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(2): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	} else {
		appCtx := appengine.NewContext(ctx.Request)
		cs, err := util.ReadFileFromBucket(appCtx, "api.yaml")
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(3): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		var conf config.APIConfigs
		if err = yaml.Unmarshal(cs, &conf); err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(4): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		apis, err = config.NewAPIsConf(conf)
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(5): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	}

	// APIを指定した回数リクエストする
	now := time.Now()
	atnd := make([]model.Parser, constant.SearchPeriod)
	connpass := make([]model.Parser, constant.SearchPeriod)
	doorKeeper := make([]model.Parser, constant.SearchPeriod)

	// それぞれのりリクエストを作成する
	// TODO: API提供元に負荷がかかるので、順次処理にしている。
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

	// 1つの配列にまとめる
	allParser := make([]model.Parser, 0)
	allParser = append(allParser, atnd...)
	allParser = append(allParser, connpass...)
	allParser = append(allParser, doorKeeper...)

	// 更新処理が発生した数をカウントする
	updateCount := 0

	// タグ情報を先に取得しておく
	tDB := model.TagsDB{}
	tags, err := tDB.GetAll(appCtx)
	if err != nil {
		log.Errorf(appCtx, "イベントを付加処理エラー(12): %v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	for _, p := range allParser {
		// リクエストを投げて、レスポンスを受取る
		cli := model.NewParser(p.URL, p.APIType, p.Token, ctx.Request)
		es, err := cli.ConvertingToJSON()
		if err != nil {
			log.Errorf(appCtx, "APIリクエストエラー(6): %v", err)
		}
		for _, v := range es {
			eDB := model.EventsDB{}
			// イベントのタグ付け
			for _, tag := range tags {
				m, err := tDB.ExistsTargetTag(tag.Regex, v.Title, v.Description)
				if err != nil {
					log.Errorf(appCtx, "イベントを付加処理エラー(13): %v", err)
				}
				if m {
					v.Tags = append(v.Tags, tag.LittleTag)
				}
			}
			// 存在するイベントなら上書き処理、存在しなければ作成
			isUpdate, err := eDB.Upsert(appCtx, &v, now)
			if err != nil {
				log.Errorf(appCtx, "Datastore イベント挿入時エラー(7): %v", err)
			}
			// 更新したか
			if isUpdate {
				updateCount++
			}
		}
	}

	// SearchAPI Index作成（仕様上作り直しになるので、日付ごとに作成する）
	events := []model.Events{}
	g := goon.FromContext(appCtx)
	// TODO: 処理を分割したいが一旦は、このままでやる
	allEvents, err := g.GetAll(datastore.NewQuery(g.Kind(&model.Events{})), &events)
	if err != nil {
		log.Errorf(appCtx, "DatastoreからSearchAPIへ移行時の取得エラー(8): %v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	sel := model.SearchEventsLogDB{}
	// 今日の日付情報でindexを作成する
	index, err := search.Open(fmt.Sprint("events", now.Format("20060102150405")))
	if err != nil {
		log.Errorf(appCtx, "index openエラー(9): %v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	// Documentを作成する
	for _, v := range allEvents {
		e := &model.Events{
			ID: v.IntID(),
		}
		err := g.Get(e)
		if err != nil {
			log.Errorf(appCtx, "Datastoreから全件取得時エラー(10): %v", err)
		}
		_, err = index.Put(appCtx, v.StringID(), e.EventToSearchEvents())
		if err != nil {
			log.Errorf(appCtx, "SearchAPIへのPUT操作エラー(10): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	}
	log.Infof(appCtx, "updateCount = %d", updateCount)
	log.Infof(appCtx, "eventCount = %d", len(events))
	// 新しいIndex情報をDatastoreに格納する
	indexName, err := sel.CreateIndex(appCtx, now)
	if err != nil {
		log.Errorf(appCtx, "SearchEventLog Create エラー(11):%v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	log.Infof(appCtx, "latestIndexName = %v", indexName)
	// CronController_FetchEvents: end_implement
	return nil
}

// UpgradeTags runs the upgradeTags action.
func (c *CronController) UpgradeTags(ctx *app.UpgradeTagsCronContext) error {
	// CronController_UpgradeTags: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	tags, err := config.NewTagFromFile("tags.yaml")
	if err != nil {
		log.Errorf(appCtx, "設定ファイル読み込みエラー(1): %v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	uTags := []model.Tags{}
	// 大タグごとにループする
	for _, v := range tags.MajorTags {
		// 小タグごとにループする
		for _, v2 := range v.LittleTags {
			t := model.Tags{}
			t.MajorTag = v.MajorTags
			t.LittleTag = v2.Name
			// タグ付け時に使う正規表現の指定が無ければ名前をそのまま使う
			if len(v2.Regex) == 0 {
				t.Regex = v2.Name
			} else {
				t.Regex = v2.Regex
			}
			uTags = append(uTags, t)
		}
	}
	tDB := model.TagsDB{}
	tDB.Upgrade(appCtx, &uTags)
	// CronController_UpgradeTags: end_implement
	return nil
}

// SendRecommendMail runs the sendRecommendMail action.
func (c *CronController) SendRecommendMail(ctx *app.SendRecommendMailCronContext) error {
	// CronController_SendRecommendMail: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	msg := &mail.Message{
		Sender:   "peeeei0804@gmail.com",
		To:       []string{"peeeei0804@gmail.com"},
		Subject:  "やっはろー",
		Body:     "律っちゃんぺろぺろ",
		HTMLBody: "<h1>律っちゃんぺろぺろ</h1>",
	}
	err := mail.Send(appCtx, msg)
	if err != nil {
		log.Errorf(appCtx, "%v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	// CronController_SendRecommendMail: end_implement
	return nil
}

// ReadFix runs the readFix action.
func (c *CronController) ReadFix(ctx *app.ReadFixCronContext) error {
	// CronController_ReadFix: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	uerDB := model.UserEventReadsDB{}
	err := uerDB.UpdateExcludeRedEventQ(appCtx, time.Now())
	if err != nil {
		log.Errorf(appCtx, "%v", err)
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	// CronController_ReadFix: end_implement
	return nil
}
