package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load() // load .env if it exists

	InitS3()
	ConnectDB()

	r := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Routes
	api := r.Group("/api")
	
	// Reports
	api.GET("/reports", getReports)
	api.POST("/reports", createReport)
	
	// Schedules
	api.GET("/schedules", getSchedules)
	api.POST("/schedules", createSchedule) // For testing

	// Workers
	api.GET("/workers", getWorkers)
	api.POST("/workers", createWorker) // For testing

	r.Run(":8080")
}

func getReports(c *gin.Context) {
	var reports []Report
	if DB != nil {
		DB.Order("created_at desc").Find(&reports)
	}
	c.JSON(http.StatusOK, reports)
}

func createReport(c *gin.Context) {
	desc := c.PostForm("description")
	location := c.PostForm("location")
	
	latStr := c.PostForm("latitude")
	lngStr := c.PostForm("longitude")
	lat, _ := strconv.ParseFloat(latStr, 64)
	lng, _ := strconv.ParseFloat(lngStr, 64)

	var imageUrl string
	file, err := c.FormFile("image")
	if err == nil {
		uploadedUrl, errUpload := UploadToS3(file)
		if errUpload != nil {
			log.Println("S3 Upload error:", errUpload)
		} else {
			imageUrl = uploadedUrl
		}
	}

	report := Report{
		Description: desc,
		Location:    location,
		Latitude:    lat,
		Longitude:   lng,
		ImageURL:    imageUrl,
		Status:      "Dilaporkan",
		CreatedAt:   time.Now(),
	}

	if DB != nil {
		DB.Create(&report)
	}

	c.JSON(http.StatusOK, report)
}

func getSchedules(c *gin.Context) {
	var schedules []Schedule
	if DB != nil {
		DB.Find(&schedules)
	} else {
		// Mock data if no DB
		schedules = []Schedule{
			{ID: 1, Location: "Kecamatan A", CollectionTime: time.Now(), TruckPlate: "D 1234 AB", Status: "Selesai"},
			{ID: 2, Location: "Kecamatan B", CollectionTime: time.Now().Add(2 * time.Hour), TruckPlate: "D 5678 CD", Status: "Pending"},
		}
	}
	c.JSON(http.StatusOK, schedules)
}

func createSchedule(c *gin.Context) {
	var sched Schedule
	if err := c.BindJSON(&sched); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if DB != nil {
		DB.Create(&sched)
	}
	c.JSON(http.StatusOK, sched)
}

func getWorkers(c *gin.Context) {
	var workers []Worker
	if DB != nil {
		DB.Find(&workers)
	} else {
		workers = []Worker{
			{ID: 1, Name: "Ahmad", Area: "Kecamatan A", Status: "Aktif", LastSeen: time.Now().String()},
			{ID: 2, Name: "Budi", Area: "Kecamatan B", Status: "Istirahat", LastSeen: time.Now().Add(-time.Hour).String()},
		}
	}
	c.JSON(http.StatusOK, workers)
}

func createWorker(c *gin.Context) {
	var worker Worker
	if err := c.BindJSON(&worker); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if DB != nil {
		DB.Create(&worker)
	}
	c.JSON(http.StatusOK, worker)
}
