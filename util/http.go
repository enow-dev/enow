package util

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

// FetchAPIresponse 外部APIのレスポンス(json)をdestに入れる
func FetchAPIresponse(client *http.Client, url string, dest interface{}) error {
	resp, err := client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close() // nolint: errcheck
	raw, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(raw, &dest); err != nil {
		return err
	}

	return nil
}
