package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/enow-dev/enow/config"
	"github.com/enow-dev/enow/util"
	"github.com/goadesign/goa"
	"google.golang.org/appengine"
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
	ID        int    `json:"id"`
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
	oauthConfs, err := config.NewOauthsFromFile("../config/oauth.yaml")
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}
	oauthConf, err := oauthConfs.Get("github.com")
	if err != nil {
		return ctx.InternalServerError(goa.ErrInternal(err))
	}

	// Github OAuthトークン取得
	tok, err := oauthConf.Exchange(appCtx, ctx.Code)
	if err != nil {
		return ctx.BadRequest(goa.ErrBadRequest(err))
	}
	client := oauthConf.Client(appCtx, tok)
	// Github ユーザー情報取得
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
	// OAuth処理完了
	log.Infof(ctx, "id %v", githubuser.ID)
	log.Infof(ctx, "avater %v", githubuser.AvaterURL)
	log.Infof(ctx, "email %v", githubuser.Email)

	// Salt作成
	//Salt := util.GetRandomString()
	//Token := util.CreateTokenHash()
	//
	//// User追加
	//user := model.Users{
	//	Name:      githubuser.Login,
	//	Email:     githubuser.Email,
	//	Token:     Salt,
	//	Salt:      Salt,
	//	AvaterURL: githubuser.AvaterURL,
	//	GithubID:  githubuser.ID,
	//	CreatedAt: time.Now(),
	//	UpdatedAt: time.Now(),
	//}

	// AuthController_Login: end_implement
	res := &app.Session{}
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
