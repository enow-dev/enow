package util

import (
	"context"
	"io/ioutil"

	"cloud.google.com/go/storage"
	"google.golang.org/appengine/file"
)

// ReadFileFromBucket GCP上のStorageにアクセスしてデータも返す
func ReadFileFromBucket(ctx context.Context, path string) ([]byte, error) {
	bucketName, err := file.DefaultBucketName(ctx)
	if err != nil {
		return nil, err
	}
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	bucket := client.Bucket(bucketName)
	reader, err := bucket.Object(path).NewReader(ctx)
	if err != nil {
		return nil, err
	}
	defer reader.Close()

	slurp, err := ioutil.ReadAll(reader)
	if err != nil {
		return nil, err
	}
	return slurp, nil
}
