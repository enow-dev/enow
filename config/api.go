package config

import (
	"errors"
	"io"
	"io/ioutil"
	"os"

	"github.com/enow-dev/enow/design/constant"

	"fmt"

	"gopkg.in/yaml.v1"
)

// APIConfigs は用途ごとのAPI情報を持つ
type APIConfigs map[string]*API

// API APIの情報
type API struct {
	URL   string `yaml:"url"`
	Token string `yaml:"token"`
}

type APIs struct {
	Connpass   API
	Doorkeeper API
	ATND       API
}

// Get 指定されたAPI情報を返す
func (sc APIConfigs) Get(purpose string) (*API, error) {
	conf, ok := sc[purpose]
	if !ok {
		return nil, errors.New("No such config")
	}

	return conf, nil
}

// NewAPIConfigsFromFile Configから設定を読み取る
func NewAPIConfigsFromFile(path string) (APIConfigs, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close() // nolint: errcheck
	return NewAPIConfigs(f)
}

// NewAPIConfigs io.ReaderからAPI設定を読み取る
func NewAPIConfigs(r io.Reader) (APIConfigs, error) {
	b, err := ioutil.ReadAll(r)
	if err != nil {
		return nil, err
	}
	var configs APIConfigs
	if err = yaml.Unmarshal(b, &configs); err != nil {
		return nil, err
	}
	return configs, nil
}

func NewAPIsConf(conf APIConfigs) (*APIs, error) {
	const errMsg = "%sの設定読み込み時にエラーが発生しました"
	a, ok := conf[constant.Atnd]
	if !ok {
		return nil, fmt.Errorf(errMsg, constant.Atnd)
	}
	c, ok := conf[constant.Connpass]
	if !ok {
		return nil, fmt.Errorf(errMsg, constant.Connpass)
	}
	d, ok := conf[constant.Doorkeeper]
	if !ok {
		return nil, fmt.Errorf(errMsg, constant.Doorkeeper)
	}
	var apis APIs
	apis.ATND.URL = a.URL
	apis.ATND.Token = a.Token

	apis.Connpass.URL = c.URL
	apis.Connpass.Token = c.Token

	apis.Doorkeeper.URL = d.URL
	apis.Doorkeeper.Token = d.Token
	return &apis, nil
}
