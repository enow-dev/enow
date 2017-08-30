package media

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var Event = MediaType("application/vnd.event+json", func() {
	Description("event")
	Attributes(func() {
		Attribute("id", String, "id", func() {
			Example("9223372036854775807")
			Pattern("^[0-9]{1,19}$")
		})
		Attribute("api_id", Integer, "APIの種別", func() {
			Example(1)
		})
		Attribute("title", String, "イベント名", func() {
			Example("イベント")
		})
		Attribute("description", String, "説明文", func() {
			Example("説明文")
		})
		Attribute("start_at", DateTime, "開始日時", func() {
			Example("2017-08-26T15:05:11.916011956Z")
		})
		Attribute("end_at", DateTime, "終了日時", func() {
			Example("2017-08-26T15:05:11.916011956Z")
		})
		Attribute("url", String, "イベントURL", func() {
			Example("http://example.com")
		})
		Attribute("address", String, "住所", func() {
			Example("大阪府大阪市北区小松原町5-8　トリオビル４F、5Ｆ")
		})
		Attribute("place", String, "開催地", func() {
			Example("大阪府大阪市北区")
		})
		Attribute("lat", Number, "緯度", func() {
			Example(34.7033395)
		})
		Attribute("lon", Number, "経度", func() {
			Example(135.5014871)
		})
		Attribute("limit", Integer, "参加上限人数", func() {
			Example(10)
		})
		Attribute("accepted", Integer, "参加済み人数", func() {
			Example(10)
		})
		Attribute("waiting", Integer, "キャンセル待ち人数", func() {
			Example(5)
		})
		Attribute("updated_at", DateTime, "更新日時", func() {
			Example("2017-08-26T15:05:11.916011956Z")
		})
		Attribute("tags", ArrayOf(String), "ジャンルタグ", func() {
			Example([]string{"js", "php", "Go"})
		})
		Attribute("is_favorite", Boolean, "お気に入り済み", func() {
			Example(false)
		})
		Required(
			"id",
			"api_id",
			"title",
			"description",
			"start_at",
			"end_at",
			"url",
			"address",
			"place",
			"lat",
			"lon",
			"limit",
			"accepted",
			"waiting",
			"updated_at",
			"is_favorite",
			"tags",
		)
	})
	View("tiny", func() {
		Attribute("id")
		Attribute("api_id")
		Attribute("title")
		//Attribute("description")
		Attribute("start_at")
		Attribute("end_at")
		Attribute("url")
		//Attribute("address")
		Attribute("place")
		//Attribute("lat")
		//Attribute("lon")
		Attribute("limit")
		Attribute("accepted")
		//Attribute("waiting")
		Attribute("updated_at")
		//Attribute("is_favorite")
		Attribute("tags")
		Required(
			"id",
			"api_id",
			"title",
			//"description",
			"start_at",
			"end_at",
			"url",
			//"address",
			"place",
			//"lat",
			//"lon",
			"limit",
			"accepted",
			//"waiting",
			"updated_at",
			//"is_favorite",
			"tags",
		)
	})
	View("default", func() {
		Attribute("id")
		Attribute("api_id")
		Attribute("title")
		Attribute("description")
		Attribute("start_at")
		Attribute("end_at")
		Attribute("url")
		Attribute("address")
		Attribute("place")
		Attribute("lat")
		Attribute("lon")
		Attribute("limit")
		Attribute("accepted")
		Attribute("waiting")
		Attribute("updated_at")
		//Attribute("is_favorite")
		Attribute("tags")
		Required(
			"id",
			"api_id",
			"title",
			"description",
			"start_at",
			"end_at",
			"url",
			"address",
			"place",
			"lat",
			"lon",
			"limit",
			"accepted",
			"waiting",
			"updated_at",
			//"is_favorite",
			"tags",
		)
	})
	View("show", func() {
		Attribute("id")
		Attribute("api_id")
		Attribute("title")
		Attribute("description")
		Attribute("start_at")
		Attribute("end_at")
		Attribute("url")
		Attribute("address")
		Attribute("place")
		Attribute("lat")
		Attribute("lon")
		Attribute("limit")
		Attribute("accepted")
		Attribute("waiting")
		Attribute("updated_at")
		Attribute("is_favorite")
		Attribute("tags")
		Required(
			"id",
			"api_id",
			"title",
			"description",
			"start_at",
			"end_at",
			"url",
			"address",
			"place",
			"lat",
			"lon",
			"limit",
			"accepted",
			"waiting",
			"updated_at",
			"is_favorite",
			"tags",
		)
	})
	View("full", func() {
		Attribute("id")
		Attribute("api_id")
		Attribute("title")
		Attribute("description")
		Attribute("start_at")
		Attribute("end_at")
		Attribute("url")
		Attribute("address")
		Attribute("place")
		Attribute("lat")
		Attribute("lon")
		Attribute("limit")
		Attribute("accepted")
		Attribute("waiting")
		Attribute("updated_at")
		Attribute("is_favorite")
		Attribute("tags")
		Required(
			"id",
			"api_id",
			"title",
			"description",
			"start_at",
			"end_at",
			"url",
			"address",
			"place",
			"lat",
			"lon",
			"limit",
			"accepted",
			"waiting",
			"updated_at",
			"is_favorite",
			"tags",
		)
	})
})
