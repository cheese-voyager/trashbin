package main

import (
	"bytes"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

var s3Client *s3.S3

func InitS3() {
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	region := os.Getenv("AWS_REGION")

	if accessKey == "" || secretKey == "" || region == "" {
		log.Println("WARNING: AWS credentials not fully set, S3 uploads may fail")
		return
	}

	creds := credentials.NewStaticCredentials(accessKey, secretKey, "")
	cfg := aws.NewConfig().WithRegion(region).WithCredentials(creds)
	sess, err := session.NewSession(cfg)
	if err != nil {
		log.Println("Failed to create AWS session:", err)
		return
	}
	s3Client = s3.New(sess)
}

func UploadToS3(file *multipart.FileHeader) (string, error) {
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// Read first 512 bytes to determine file type
	buffer := make([]byte, 512)
	src.Read(buffer)
	src.Seek(0, 0) // reset after reading

	contentType := http.DetectContentType(buffer)
	
	// generate unique filename
	filename := uuid.New().String() + "-" + file.Filename

	bucket := os.Getenv("AWS_S3_BUCKET")
	if bucket == "" {
		return "", fmt.Errorf("AWS_S3_BUCKET is not configured")
	}

	var size int64 = file.Size
	fileBuffer := make([]byte, size)
	src.Read(fileBuffer)

	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Bucket:        aws.String(bucket),
		Key:           aws.String(filename),
		ACL:           aws.String("public-read"),
		Body:          bytes.NewReader(fileBuffer),
		ContentLength: aws.Int64(int64(size)),
		ContentType:   aws.String(contentType),
	})

	if err != nil {
		return "", err
	}

	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", bucket, os.Getenv("AWS_REGION"), filename), nil
}
