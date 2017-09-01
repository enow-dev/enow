package config

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewOauthConfigs(t *testing.T) {
	assert := assert.New(t)
	r := strings.NewReader(`
github.com:
  client_id: 430922799f0e31b705d4
  client_secret: 736eb4dae6df4b5b1a890eddbe3728aa2d811ba8
  endpoint:
    auth_url: https://github.com/login/oauth/authorize
    token_url: https://github.com/login/oauth/access_token
`)
	configs, err := NewOauths(r)
	assert.NoError(err)
	c, err := configs.Get("github.com")
	assert.NoError(err)
	assert.Equal("430922799f0e31b705d4", c.ClientID, "they should be equal")
	assert.Equal("736eb4dae6df4b5b1a890eddbe3728aa2d811ba8", c.ClientSecret, "they should be equal")
}
