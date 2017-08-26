package util

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestConvertIDIntoInt64(t *testing.T) {
	assert := assert.New(t)
	int64ID, err := ConvertIDIntoInt64("5649050225344512")
	assert.NoError(err)
	assert.Equal(int64(5649050225344512), int64ID)
}

func TestCopyStruct(t *testing.T) {

	type srcStruct struct {
		Str  string
		Int  int
		Time time.Time
	}

	type dstStruct struct {
		Str  string
		Int  int
		Time time.Time
	}

	var src srcStruct
	var dst dstStruct

	src.Str = "string"
	src.Int = 10
	src.Time = time.Now()

	// 元となる構造体　src
	// 格納先に構造体　dst
	err := CopyStruct(src, &dst)
	if err != nil {
		t.Fatalf("構造体のコピー時にエラーが発生しました　%v", err)
	}

	if src.Str != dst.Str {
		t.Fatalf("求められているフォーマットと違います　%s", dst.Str)
	}

	if src.Int != dst.Int {
		t.Fatalf("求められているフォーマットと違います　%d", dst.Int)
	}

	if src.Time != dst.Time {
		t.Fatalf("求められているフォーマットと違います　%s", dst.Time)
	}
}
