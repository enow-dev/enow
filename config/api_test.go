package config

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewAPIConfigs(t *testing.T) {
	assert := assert.New(t)
	r := strings.NewReader(`
atnd:
  url: https://api.atnd.org/events/?count=100&format=jsonp&callback=
  token: test

connpass:
  url: https://connpass.com/api/v1/event/?count=100
  token:

doorkepper:
  url: https://api.doorkeeper.jp/events
  token:`)
	configs, err := NewAPIConfigs(r)
	assert.NoError(err)
	c, ok := configs["atnd"]
	assert.True(ok)
	assert.Equal("https://api.atnd.org/events/?count=100&format=jsonp&callback=", c.URL, "url should be equal")
	assert.Equal("test", c.Token, "token should be equal")
}
