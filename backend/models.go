package main

import "time"

type Report struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Description  string    `json:"description"`
	Location     string    `json:"location"`
	Latitude     float64   `json:"latitude"`
	Longitude    float64   `json:"longitude"`
	ImageURL     string    `json:"image_url"`
	Status       string    `json:"status"` // "Dilaporkan", "Diproses", "Selesai"
	CreatedAt    time.Time `json:"created_at"`
}

type Schedule struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Location       string    `json:"location"`
	CollectionTime time.Time `json:"collection_time"`
	TruckPlate     string    `json:"truck_plate"`
	Status         string    `json:"status"` // "Pending", "Dalam Perjalanan", "Selesai"
}

type Worker struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `json:"name"`
	Area     string `json:"area"`
	Status   string `json:"status"` // "Aktif", "Istirahat", "Luar Kota"
	LastSeen string `json:"last_seen"` // timestamp as string or specific location
}
