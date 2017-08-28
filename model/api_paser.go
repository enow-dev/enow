package model

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/enow-dev/enow/design/constant"
	"github.com/enow-dev/enow/util"
	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func NewParser(rawurl string, rawapi int, token string, r *http.Request) *Parser {
	return &Parser{
		URL:     rawurl,
		APIType: rawapi,
		Token:   token,
		Request: r,
	}
}

type Parser struct {
	URL      string
	APIType  int
	Token    string
	RespByte []byte
	err      error
	Request  *http.Request
}

func (p *Parser) sendQuery() {
	ctx := appengine.NewContext(p.Request)
	req, err := http.NewRequest("GET", p.URL, nil)
	if err != nil {
		fmt.Fprint(os.Stderr, err)
		p.err = err
		return
	}
	if p.Token != "" {
		req.Header.Set("Authorization", p.Token)
	}

	client := urlfetch.Client(ctx)
	resp, err := client.Do(req)
	if resp == nil {
		fmt.Fprint(os.Stderr, errors.New("Not Found URL check Request Url"))
		p.err = errors.New("Not Found URL check Request Url")
		return
	}
	defer resp.Body.Close()

	respByte, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprint(os.Stderr, err)
		p.err = err
		return
	}
	p.RespByte = respByte
}

func (p *Parser) atndJsonParse() (events []Events, err error) {
	var at ATND
	err = json.Unmarshal(p.RespByte, &at)
	if err != nil {
		fmt.Fprint(os.Stderr, err)
		p.err = err
		return events, nil
	}
	e := new(Events)
	events = make([]Events, len(at.Events))
	for i, v := range at.Events {
		util.CopyStruct(v.Event, e)
		events[i] = *e
		events[i].APIID = constant.AtndID
		events[i].Coords.Lat, _ = strconv.ParseFloat(v.Event.Lat, 64)
		events[i].Coords.Lng, _ = strconv.ParseFloat(v.Event.Lon, 64)
		events[i].Identification = fmt.Sprintf("%d-%d", constant.AtndID, v.Event.APIEventID)
		events[i].Address = util.ConcatenateString(v.Event.Address, v.Event.Place)
		events[i].Pref = util.ConvertIDFromAddress(v.Event.Address)
		events[i].Hash = createDataHash(events[i])
	}
	return events, nil
}

func (p *Parser) connpassJsonParse() (events []Events, err error) {
	var cp Connpass
	err = json.Unmarshal(p.RespByte, &cp)
	if err != nil {
		fmt.Fprint(os.Stderr, err)
		p.err = err
		return events, nil
	}

	e := new(Events)
	events = make([]Events, len(cp.Events))
	for i, v := range cp.Events {
		util.CopyStruct(v, e)
		events[i] = *e
		events[i].APIID = constant.ConnpassID
		events[i].Coords.Lat, _ = strconv.ParseFloat(v.Lat, 64)
		events[i].Coords.Lng, _ = strconv.ParseFloat(v.Lon, 64)
		events[i].Identification = fmt.Sprintf("%d-%d", constant.ConnpassID, v.APIEventID)
		events[i].Address = util.ConcatenateString(v.Address, v.Place)
		events[i].Pref = util.ConvertIDFromAddress(v.Address)
		events[i].Hash = createDataHash(events[i])
	}
	return events, nil
}

func (p *Parser) doorkeeperJsonParse() (events []Events, err error) {
	var dk Doorkeeper
	err = json.Unmarshal(p.RespByte, &dk)
	if err != nil {
		fmt.Fprint(os.Stderr, err)
		p.err = err
		return events, nil
	}

	e := new(Events)
	events = make([]Events, len(dk))
	for i, v := range dk {
		util.CopyStruct(v.Event, e)
		events[i] = *e
		events[i].APIID = constant.DoorkeeperID
		events[i].Address = util.RemovePoscode(events[i].Address)
		events[i].Coords.Lat, _ = strconv.ParseFloat(v.Event.Lat, 64)
		events[i].Coords.Lng, _ = strconv.ParseFloat(v.Event.Long, 64)
		events[i].Identification = fmt.Sprintf("%d-%d", constant.DoorkeeperID, v.Event.APIEventID)
		events[i].Pref = util.ConvertIDFromAddress(v.Event.Address)
		events[i].Hash = createDataHash(events[i])
	}
	return events, nil
}

func createDataHash(e Events) string {
	d := util.ConcatenateString(
		e.Title,
		e.Description,
		e.URL,
		e.Address,
		string(e.Limit),
		string(e.Accepted),
		string(e.StartAt.Format("2006-01-02 15:04:05")),
		string(e.EndAt.Format("2006-01-02 15:04:05")))
	return util.GenHashFromString(d)
}

func (p *Parser) ConvertingToJson() (events []Events, err error) {
	p.sendQuery()
	if p.APIType == constant.AtndID {
		return p.atndJsonParse()
	} else if p.APIType == constant.ConnpassID {
		return p.connpassJsonParse()
	} else if p.APIType == constant.DoorkeeperID {
		return p.doorkeeperJsonParse()
	}
	return events, errors.New("未知のAPIがセットされています。")
}
