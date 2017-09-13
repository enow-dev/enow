package controller

import (
	"strconv"
	"time"

	yaml "gopkg.in/yaml.v1"

	"golang.org/x/oauth2"

	"os"

	"fmt"

	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/config"
	"github.com/enow-dev/enow/model"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"github.com/huandu/facebook"
	"github.com/mjibson/goon"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

// AuthController implements the auth resource.
type AuthController struct {
	*goa.Controller
}

// NewAuthController creates a auth controller.
func NewAuthController(service *goa.Service) *AuthController {
	return &AuthController{Controller: service.NewController("AuthController")}
}

// GithubUser Githubから取得したユーザー情報
type GithubUser struct {
	ID        int64  `json:"id"`
	Login     string `json:"login"`
	Email     string `json:"email"`
	AvaterURL string `json:"avatar_url"`
}

// email Githubに登録されたメールアドレス
type email struct {
	Email    string `json:"email"`
	Primary  bool   `json:"primary"`
	Verified bool   `json:"verified"`
}

// Login runs the login action.
func (c *AuthController) Login(ctx *app.LoginAuthContext) error {
	// AuthController_Login: start_implement

	// Put your logic here
	appCtx := appengine.NewContext(ctx.Request)
	var oauthConf *oauth2.Config
	// TODO: 関数を別で作成する
	if os.Getenv("Op") == "develop" {
		oauthConfs, err := config.NewOauthsFromFile("../config/oauth.yaml")
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(1): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		oauthConf, err = oauthConfs.Get(ctx.Provider)
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(2): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	} else {
		cs, err := util.ReadFileFromBucket(appCtx, "oauth.yaml")
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(3): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		var conf config.Oauths
		if err = yaml.Unmarshal(cs, &conf); err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(4): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		oauthConf, err = conf.Get(ctx.Provider)
		if err != nil {
			log.Errorf(appCtx, "設定ファイル読み込みエラー(5): %v", err)
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	}
	log.Infof(appCtx, "%v", oauthConf.AuthCodeURL(""))

	// OAuthトークン取得
	tok, err := oauthConf.Exchange(appCtx, ctx.Code)
	if err != nil {
		return ctx.BadRequest(goa.ErrBadRequest(err))
	}
	client := oauthConf.Client(appCtx, tok)
	// プロバイダごとに処理が違うので分岐する
	// Github ユーザー情報取得
	newUser := &model.Users{}
	var loginUserKey *datastore.Key
	var ID int64
	switch ctx.Provider {
	case config.FacebookOAuth:
		// TODO ここらへん使いまわすので、関数化したい
		session := facebook.Session{
			Version:    "v2.10",
			HttpClient: client,
		}
		res, err := session.Get("/me?fields=id,name,email,picture.type(large)", nil)
		if err != nil {
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		strID, ok := res["id"].(string)
		if !ok {
			return ctx.BadRequest(goa.ErrBadRequest(fmt.Errorf("Facebook OAuth(1)")))
		}
		int64ID, err := strconv.ParseInt(strID, 10, 64)
		if err != nil {
			return ctx.BadRequest(goa.ErrBadRequest(fmt.Errorf("Facebook OAuth(2) %v", err)))
		}
		ID = int64ID
		name := res["name"].(string)
		email := res["email"].(string)
		picture := res["picture"].(map[string]interface{})
		pictureData := picture["data"].(map[string]interface{})
		pictureURL := pictureData["url"].(string)
		newUser.Name = name
		newUser.Email = email
		newUser.AvaterURL = pictureURL
		newUser.FacebookID = ID
	case config.GithubOAuth:
		// TODO ここらへん使いまわすので、関数化したい
		githubuser := GithubUser{}
		err = util.FetchAPIresponse(client, "https://api.github.com/user", &githubuser)
		if err != nil {
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		// Githubに登録しているメールアドレスを取得(非公開でも取れる)
		emails := []email{}
		err = util.FetchAPIresponse(client, "https://api.github.com/user/emails", &emails)
		if err != nil {
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
		// メインのメアドを使う
		for _, v := range emails {
			if v.Primary && v.Verified {
				githubuser.Email = v.Email
				break
			}
		}
		ID = githubuser.ID
		newUser.Name = githubuser.Login
		newUser.Email = githubuser.Email
		newUser.AvaterURL = githubuser.AvaterURL
		newUser.GithubID = githubuser.ID
	}

	// 既にユーザーが存在しているか確認する
	uDB := model.UsersDB{}
	loginUserKey, err = uDB.GetKeyFindByOauthID(appCtx, ID, ctx.Provider)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	g := goon.FromContext(appCtx)

	// tokenを生成するが、被っている可能生があるのでチェックする
	token := util.CreateTokenHash(string(ID))
	alreadyRegisteredUser, err := uDB.GetUserKeyFindByToken(appCtx, token)
	for {
		// 既に同じTokenがあれば再生成する
		if err != nil && alreadyRegisteredUser != nil {
			token = util.CreateTokenHash(string(ID))
		} else {
			break
		}
	}
	// 1トランザクションにしたいが、Datastoreの仕様上、commitしてないユーザーの取得が無理だった
	// ユーザーが存在していないので、作成する
	now := time.Now()
	if loginUserKey == nil {
		newUser.CreatedAt = now
		newUser.Expire = now.AddDate(0, 0, 7)
		newUser.Token = token
		loginUserKey, err = g.Put(newUser)
		if err != nil {
			return ctx.InternalServerError(goa.ErrInternal(err))
		}
	}
	loginUser, err := uDB.UpdateToken(appCtx, loginUserKey, now, token)
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	// AuthController_Login: end_implement
	res := &app.Session{
		Token:     loginUser.Token,
		Name:      loginUser.Name,
		Expire:    loginUser.Expire,
		AvaterURL: loginUser.AvaterURL,
	}
	return ctx.OK(res)
}

// Logout runs the logout action.
func (c *AuthController) Logout(ctx *app.LogoutAuthContext) error {
	// AuthController_Logout: start_implement

	// Put your logic here

	// AuthController_Logout: end_implement
	res := &app.Session{}
	return ctx.OK(res)
}
