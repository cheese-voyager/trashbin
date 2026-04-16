package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Format for PostgreSQL RDS connection
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)
	
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("WARNING: Failed to connect to database. Checking if DB_HOST is set:", err)
		// We will not fatal out immediately to allow startup for other tests if needed
	} else {
		log.Println("Successfully connected to Database")
		DB = database
		DB.AutoMigrate(&Report{}, &Schedule{}, &Worker{})
	}
}
