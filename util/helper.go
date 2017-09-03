package util

import (
	"bytes"
	"fmt"
	"reflect"
	"strconv"
	"strings"

	"regexp"

	"unicode/utf8"

	"golang.org/x/exp/utf8string"
)

// ConvertIDIntoInt64 文字列をint64に変換する
func ConvertIDIntoInt64(ID interface{}) (int64, error) {
	strID := fmt.Sprintf("%v", ID)
	int64ID, err := strconv.ParseInt(strID, 10, 64)
	if err != nil {
		return 0, err
	}
	if len(strID) != 16 {
		return 0, fmt.Errorf("ID: %v is wrong format ^[0-9]{16}$", int64ID)
	}
	return int64ID, nil
}

// CopyStruct 構造体をコピーする。変数名と型で判定している。
func CopyStruct(src interface{}, dst interface{}) error {

	// Valueを調べる
	fv := reflect.ValueOf(src)

	// 型を調べる
	ft := fv.Type()

	// ポインタ型か
	if fv.Kind() == reflect.Ptr {
		ft = ft.Elem()
		fv = fv.Elem()
	}

	// ポインタ型か
	tv := reflect.ValueOf(dst)
	if tv.Kind() != reflect.Ptr {
		return fmt.Errorf("[Error] non-pointer: %v", dst)
	}

	//フィールド数
	num := ft.NumField()
	for i := 0; i < num; i++ {
		// フィールドを抜き出す
		field := ft.Field(i)

		// 存在していれば中に入る
		if !field.Anonymous {
			// フィールドの名前確認
			name := field.Name

			// name指定して中身を取り出す
			srcField := fv.FieldByName(name)

			// name指定して、そのフィールドが存在するか
			dstField := tv.Elem().FieldByName(name)

			// フィールドの存在チェック
			if srcField.IsValid() && dstField.IsValid() {
				// 型が同じか
				if srcField.Type() == dstField.Type() {
					// 同じなら格納
					dstField.Set(srcField)
				}
			}
		}
	}
	return nil
}

var rePoscode = regexp.MustCompile(`〒*\d{3}.*\d{4}`)

// RemovePoscode 郵便番号削除
func RemovePoscode(str string) string {
	str = rePoscode.ReplaceAllString(str, "")
	return str
}

var reSpace = regexp.MustCompile(`( |　)`)

// RemoveSpace 無駄なスペースを削除する
func RemoveSpace(str string) string {
	str = reSpace.ReplaceAllString(str, "")
	return str
}

var reAddress = regexp.MustCompile(`((?:旭川|伊達|石狩|盛岡|奥州|田村|南相馬|那須塩原|東村山|武蔵村山|羽村|十日町|上越|富山|野々市|大町|蒲郡|四日市|姫路|大和郡山|廿日市|下松|岩国|田川|大村)市|.+?郡(?:玉村|大町|.+?)[町村]|.+?市.+?区|.+?[市区町村])`)

// GetAreaFromAddress 住所から市区町村までを取得する
func GetAreaFromAddress(address string) string {
	vs := reAddress.FindSubmatch([]byte(address))
	if len(vs) != 2 {
		return ""
	}
	if vs[1] == nil {
		return ""
	}
	return string(vs[1])
}

// FormatAddress 住所情報の整形をする　さらに情報が増えたら配列で引数を取る
func FormatAddress(address string) string {
	address = RemoveSpace(address)
	address = RemovePoscode(address)
	address = strings.TrimSpace(address)
	return address
}

// nolint
func RemoveDuplicateInt64(args []int64) []int64 {
	results := make([]int64, 0, len(args))
	encountered := map[int64]bool{}
	for i := 0; i < len(args); i++ {
		if !encountered[args[i]] {
			encountered[args[i]] = true
			results = append(results, args[i])
		}
	}
	return results
}

// DelimiterByCharCon 指定区切り文字でも字を連結する
func DelimiterByCharCon(delimiter string, strs ...string) string {
	var concatenateStr bytes.Buffer
	for _, v := range strs {
		concatenateStr.Write([]byte(v))
		concatenateStr.Write([]byte(delimiter))
	}
	return concatenateStr.String()
}

// ConvertIDFromAddress 文字列から都道府県判別する
func ConvertIDFromAddress(prefName string) int {
	// TODO 今後出来れば住所が不正確なものも対応したい & かなりいい加減
	// 2文字以下なら処理しない
	if utf8.RuneCountInString(prefName) < 2 {
		return 0
	}

	// 都道府県検索
	if utf8.RuneCountInString(prefName) >= 3 {
		p := utf8string.NewString(prefName).Slice(0, 3)
		if prefs[p] != 0 {
			return prefs[p]
		}
		for k, v := range prefs {
			if strings.Index(prefName, k) != -1 {
				return v
			}
		}
	}
	// 県庁所在地
	p := utf8string.NewString(prefName).Slice(0, 2)
	if captals[p] != 0 {
		return captals[p]
	}
	for k, v := range captals {
		if strings.Index(prefName, k) != -1 {
			return v
		}
	}
	// 東京23区検索
	p = utf8string.NewString(prefName).Slice(0, 2)
	if tokyos[p] != 0 {
		return tokyos[p]
	}
	for k, v := range tokyos {
		if strings.Index(prefName, k) != -1 {
			return v
		}
	}
	return 0
}

var prefs = map[string]int{
	"北海道": 1,
	"青森県": 2,
	"岩手県": 3,
	"宮城県": 4,
	"秋田県": 5,
	"山形県": 6,
	"福島県": 7,
	"茨城県": 8,
	"栃木県": 9,
	"群馬県": 10,
	"埼玉県": 11,
	"千葉県": 12,
	"東京都": 13,
	"神奈川": 14,
	"新潟県": 15,
	"富山県": 16,
	"石川県": 17,
	"福井県": 18,
	"山梨県": 19,
	"長野県": 20,
	"岐阜県": 21,
	"静岡県": 22,
	"愛知県": 23,
	"三重県": 24,
	"滋賀県": 25,
	"京都府": 26,
	"大阪府": 27,
	"兵庫県": 28,
	"奈良県": 29,
	"和歌山": 30,
	"鳥取県": 31,
	"島根県": 32,
	"岡山県": 33,
	"広島県": 34,
	"山口県": 35,
	"徳島県": 36,
	"香川県": 37,
	"愛媛県": 38,
	"高知県": 39,
	"福岡県": 40,
	"佐賀県": 41,
	"長崎県": 42,
	"熊本県": 43,
	"大分県": 44,
	"宮崎県": 45,
	"鹿児島": 46,
	"沖縄県": 47,
}

var tokyos = map[string]int{
	// 東京23区
	"千代": 13,
	"中央": 13,
	"港区": 13,
	"文京": 13,
	"台東": 13,
	"墨田": 13,
	"江東": 13,
	"品川": 13,
	"目黒": 13,
	"大田": 13,
	"世田": 13,
	"渋谷": 13,
	"中野": 13,
	"杉並": 13,
	"豊島": 13,
	"北区": 13,
	"荒川": 13,
	"板橋": 13,
	"練馬": 13,
	"足立": 13,
	"葛飾": 13,
	"江戸": 13,
}

var captals = map[string]int{
	// 県庁所在地
	"札幌": 1,
	"青森": 2,
	"盛岡": 3,
	"仙台": 4,
	"秋田": 5,
	"山形": 6,
	"福島": 7,
	"水戸": 8,
	"宇都": 9,
	"前橋": 10,
	"さい": 11,
	"千葉": 12,
	"新宿": 13,
	"横浜": 14,
	"新潟": 15,
	"富山": 16,
	"金沢": 17,
	"福井": 18,
	"甲府": 19,
	"長野": 20,
	"岐阜": 21,
	"静岡": 22,
	"名古": 23,
	"津市": 24,
	"大津": 25,
	"京都": 26,
	"大阪": 27,
	"神戸": 28,
	"奈良": 29,
	"和歌": 30,
	"鳥取": 31,
	"松江": 32,
	"岡山": 33,
	"広島": 34,
	"山口": 35,
	"徳島": 36,
	"高松": 37,
	"松山": 38,
	"高知": 39,
	"福岡": 40,
	"佐賀": 41,
	"長崎": 42,
	"熊本": 43,
	"大分": 44,
	"宮崎": 45,
	"鹿児": 46,
	"那覇": 47,
}
