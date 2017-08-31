package controller

import (
	"github.com/enow-dev/enow/app"
	"github.com/goadesign/goa"
	"golang.org/x/oauth2"
)

// AuthController implements the auth resource.
type AuthController struct {
	*goa.Controller
	oauthConf *oauth2.Config
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
