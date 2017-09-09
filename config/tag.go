package config

import (
	"io"
	"io/ioutil"
	"os"

	yaml "gopkg.in/yaml.v1"
)

// LittleTags 小タグ情報
type LittleTags struct {
	Name  string `yaml:"name"`
	Regex string `yaml:"regex"`
}

// MajorTags 大タグ情報
type MajorTags struct {
	MajorTags  string       `yaml:"majorTags"`
	LittleTags []LittleTags `yaml:"littleTags"`
}

// Tags タグ情報
type Tags struct {
	MajorTags []MajorTags `tags`
}

// NewTagFromFile 設定を読み取る
func NewTagFromFile(path string) (*Tags, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close() // nolint: errcheck
	return NewTag(f)
}

// NewTag io.Readerから設定を読み取る
func NewTag(r io.Reader) (*Tags, error) {
	b, err := ioutil.ReadAll(r)
	if err != nil {
		return nil, err
	}
	var tags Tags
	if err = yaml.Unmarshal(b, &tags); err != nil {
		return nil, err
	}
	return &tags, nil
}
