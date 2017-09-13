package config

import (
	"errors"
	"io"
	"io/ioutil"
	"os"

	"golang.org/x/oauth2"
	"gopkg.in/yaml.v1"
)

// Oauths はサービスごとのOauth認証情報を持つ
type Oauths map[string]*Oauth

// Oauth Oauth認証情報
type Oauth struct {
	ClientID     string `yaml:"client_id"`
	ClientSecret string `yaml:"client_secret"`
	RedirectURL  string `yaml:"redirect_url"`
	Endpoint     struct {
		AuthURL  string `yaml:"auth_url"`
		TokenURL string `yaml:"token_url"`
	} `yaml:"endpoint"`
}

// nolint
const (
	FacebookOAuth = "facebook"
	TwitterOAuth  = "twitter"
	GithubOAuth   = "github"
	GoogleOAuth   = "google"
)

// Get は指定されたサービスのOauth認証情報を返す
func (oc Oauths) Get(service string) (*oauth2.Config, error) {
	conf, ok := oc[service]
	if !ok {
		return nil, errors.New("No such config")
	}

	switch service {
	case FacebookOAuth:
		if conf.ClientID == "" ||
			conf.ClientSecret == "" ||
			conf.Endpoint.AuthURL == "" ||
			conf.Endpoint.TokenURL == "" ||
			conf.RedirectURL == "" {
			return nil, errors.New("Facebook OAuth No enough data")
		}
		return &oauth2.Config{
			ClientID:     conf.ClientID,
			ClientSecret: conf.ClientSecret,
			RedirectURL:  conf.RedirectURL,
			Scopes:       []string{"public_profile", "email"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  conf.Endpoint.AuthURL,
				TokenURL: conf.Endpoint.TokenURL,
			},
		}, nil
	case GithubOAuth:
		if conf.ClientID == "" ||
			conf.ClientSecret == "" ||
			conf.Endpoint.AuthURL == "" ||
			conf.Endpoint.TokenURL == "" {
			return nil, errors.New("Github OAuth No enough data")
		}
		return &oauth2.Config{
			ClientID:     conf.ClientID,
			ClientSecret: conf.ClientSecret,
			Scopes:       []string{"user:email"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  conf.Endpoint.AuthURL,
				TokenURL: conf.Endpoint.TokenURL,
			},
		}, nil
	}
	return nil, errors.New("想定されていないOAuthの種類が指定されました")
}

// NewOauthsFromFile Configから設定を読み取る
func NewOauthsFromFile(path string) (Oauths, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close() // nolint: errcheck
	return NewOauths(f)
}

// NewOauths io.ReaderからOauth設定を読み取る
func NewOauths(r io.Reader) (Oauths, error) {
	b, err := ioutil.ReadAll(r)
	if err != nil {
		return nil, err
	}
	var configs Oauths
	if err = yaml.Unmarshal(b, &configs); err != nil {
		return nil, err
	}
	return configs, nil
}
