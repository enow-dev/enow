package mock

import (
	"time"

	"github.com/enow-dev/enow/app"
)

// CreateEventMedia EventMediaのmockデータ作成
func CreateEventMedia() app.EventFull {
	event := app.EventFull{}
	event.ID = 9223372036854775807
	event.IDStr = "9223372036854775807"
	event.APIID = 1
	event.Title = "イベント"
	event.Description = "<p>はじめに<br />\n登録の手順</p>\n<p>1.Google、Yahoo!、mixiなどのIDを利用しログインします。<br />\n2.名前を登録します。<br />\n3.設定にてメールアドレスを登録します。(メッセのやりとりがあると通知されます）</p>\n<p>内容はこちら。 <br />\nお酒を飲みますので未成年の参加はダメよー、ダメダメ。</p>\n<p>【日時（予定）】1/25（日）19:00スタート（2時間） <br />\n【場所（予定）】個室空間　楽宴の贈りもの　梅田店<br />\n【会費（予定）】男性3500円<br />\n　　　　　　　　女性2500円<br />\n【人数】20名<br />\n【募集期限】1/18（日）</p>\n<p>参加してくださる人は</p>\n<p>【名前】 <br />\n【性別】 <br />\n【成人ですか？】 <br />\n【好きな作品】 <br />\n【好きなキャラ】 <br />\n【何か一言】</p>\n<p>こちらをメッセにて送ってください。<br />\n名札を作成させていただきます。</p>\n<p>あと皆さん良い大人だと思いますので必要ないかもしれませんが <br />\n一応注意事項です。</p>\n<p>【注意事項】 <br />\n・未成年の参加はダメよー、ダメダメ。<br />\n・他人に迷惑をかける行為、悪質な行為は帰っていただきます。その際に返金はいたしません。 <br />\n・お酒に自信ニキでも節度ある行動お願いします。 一応終電の確認もオナシャス！！<br />\n・アドレスの登録はよく確認するアドレスでお願いします。一定期間、連絡が取れなかった場合はキャンセルとさせていただく場合がございます。<br />\n・開催の1週間程前にメッセを送らせていただきます。その後参加者リストの作成に取り掛かります。それまでは仮参加となりますのでご注意ください。</p>\n<p>何か質問等ございましたら、メッセか<br />\ntaconyan39@gmail.com</p>\n<p>までお願いします。</p>\n<p>それでは当日楽しみましょう！</p>"
	event.StartAt = time.Now()
	event.EndAt = time.Now()
	event.URL = "http://example.com"
	event.Address = "大阪府大阪市北区小松原町5-8　トリオビル４F、5Ｆ"
	event.Place = "大阪府大阪市北区"
	event.Lat = 34.7033395
	event.Lon = 135.5014871
	event.Limit = 10
	event.Accepted = 10
	event.Waiting = 5
	event.CreatedAt = time.Now()
	event.UpdatedAt = time.Now()
	event.IsFavorite = true
	return event
}

// CreateUserMedia mockデータ作成
func CreateUserMedia() app.UserFull {
	user := app.UserFull{}
	user.ID = 9223372036854775807
	user.IDStr = "9223372036854775807"
	user.Name = "ユーザー名"
	return user
}
