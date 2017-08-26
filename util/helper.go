package util

import (
	"fmt"
	"reflect"
	"strconv"
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
