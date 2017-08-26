package media

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var Events = MediaType("application/vnd.events+json", func() {
	Description("events")
	Attributes(func() {
		Attribute("id", Any, "id", func() {
			Example(9223372036854775807)
		})
		Attribute("id_str", String, "id(string)", func() {
			Example("9223372036854775807")
		})
		Attribute("title", String, "イベント名", func() {
			Example("イベント")
		})
		Attribute("description", String, "説明文", func() {
			Example("説明文")
		})
		Attribute("start_at", DateTime, "開始日時")
		Attribute("end_at", DateTime, "終了日時")
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
		Attribute("created_at", DateTime, "作成日時")
		Attribute("updated_at", DateTime, "更新日時")
		Attribute("isFavorite", Boolean, "お気に入り済み", func() {
			Example(false)
		})
	})
	View("tiny", func() {
		Attribute("id")
		Attribute("id_str")
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
		Attribute("created_at")
		Attribute("updated_at")
		//Attribute("isFavorite")
		Required(
			"id",
			"id_str",
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
			"created_at",
			"updated_at",
			//"isFavorite",
		)
	})
	View("default", func() {
		Attribute("id")
		Attribute("id_str")
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
		Attribute("created_at")
		Attribute("updated_at")
		//Attribute("isFavorite")
		Required(
			"id",
			"id_str",
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
			"created_at",
			"updated_at",
			//"isFavorite",
		)
	})
	View("show", func() {
		Attribute("id")
		Attribute("id_str")
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
		Attribute("created_at")
		Attribute("updated_at")
		Attribute("isFavorite")
		Required(
			"id",
			"id_str",
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
			"created_at",
			"updated_at",
			"isFavorite",
		)
	})
})
