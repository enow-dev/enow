package config

import (
	"errors"
	"io"
	"io/ioutil"
	"os"

	"gopkg.in/yaml.v1"
)

// APIConfigs は用途ごとのAPI情報を持つ
type APIConfigs map[string]*API

type APIs struct {
	Connpass   API
	Doorkeeper API
	ATND       API
}

// API APIの情報
type API struct {
	URL   string `yaml:"url"`
	Token string `yaml:"token"`
	Scope string `yaml:"scope"`
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
