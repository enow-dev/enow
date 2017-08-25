package design

import "github.com/deadcheat/goacors"

var devCORS = &goacors.GoaCORSConfig{
	AllowOrigins:     []string{"*"},
	AllowMethods:     []string{goacors.GET, goacors.HEAD, goacors.PUT, goacors.POST, goacors.DELETE, goacors.OPTIONS},
	AllowHeaders:     []string{"Content-Type", "X-Authorization"},
	AllowCredentials: false,
	MaxAge:           600,
}

var stagingCORS = &goacors.GoaCORSConfig{
	AllowOrigins:     []string{"https://enow-staging.appspot.com/https://enow-staging.net"},
	AllowMethods:     []string{goacors.GET, goacors.HEAD, goacors.PUT, goacors.POST, goacors.DELETE, goacors.OPTIONS},
	AllowHeaders:     []string{"Content-Type", "X-Authorization"},
	AllowCredentials: false,
	MaxAge:           600,
}

var productionCORS = &goacors.GoaCORSConfig{
	AllowOrigins:     []string{"https://enow.jp"},
	AllowMethods:     []string{goacors.GET, goacors.HEAD, goacors.PUT, goacors.POST, goacors.DELETE, goacors.OPTIONS},
	AllowHeaders:     []string{"Content-Type", "X-Authorization"},
	AllowCredentials: false,
	MaxAge:           600,
}

var CorsConfig = map[string]*goacors.GoaCORSConfig{
	"develop":    devCORS,
	"staging":    stagingCORS,
	"production": productionCORS,
}
