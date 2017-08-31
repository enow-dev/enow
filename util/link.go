package util

import (
	"fmt"

	"net/url"

	"github.com/goadesign/goa"
	"github.com/tomnomnom/linkheader"
	"google.golang.org/appengine/search"
)

// CreateLinkHeader レスポンスヘッダのLinkに付加するページングリンク情報を作成する
func CreateLinkHeader(reqData *goa.RequestData, scheme string, cursor search.Cursor) linkheader.Link {
	if cursor == "" {
		return linkheader.Link{}
	}
	uURI, err := url.Parse(reqData.RequestURI)
	if err != nil {
		return linkheader.Link{}
	}
	u := fmt.Sprint(scheme, "://", reqData.Host, uURI.Path, "?cursor=", cursor)
	return linkheader.Link{URL: u, Rel: "next"}
}
