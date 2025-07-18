package main

import (
	"context"
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
)

type URL struct {
	ID           string    `json:"id"`
	OriginalURL  string    `json:"original_url"`
	ShortURL     string    `json:"short_url"`
	CreationDate time.Time `json:"creation_date"`
}

var db *sql.DB

func initDB() {
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Panicf("Failed to open DB connection: %v", err)
	}

	// Retry logic
	maxAttempts := 5
	for attempts := 1; attempts <= maxAttempts; attempts++ {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		err = db.PingContext(ctx)
		if err == nil {
			break
		}

		log.Printf("DB not reachable (attempt %d/%d): %v", attempts, maxAttempts, err)
		time.Sleep(3 * time.Second)
	}

	if err != nil {
		log.Panicf("DB not reachable after retries: %v", err)
	}

	log.Println("Connected to the database!")
	createTable()
}

func createTable() {
	query := `
	CREATE TABLE IF NOT EXISTS urls (
		id TEXT PRIMARY KEY,
		original_url TEXT NOT NULL,
		short_url TEXT NOT NULL,
		creation_date TIMESTAMP NOT NULL
	)`
	_, err := db.Exec(query)
	if err != nil {
		log.Panicf("Error creating table: %v", err)
	}
}

func generateShortURL(originalURL string) string {
	hasher := md5.New()
	hasher.Write([]byte(originalURL))
	hash := hex.EncodeToString(hasher.Sum(nil))
	return hash[:8]
}

func createURL(originalURL string) string {
	shortURL := generateShortURL(originalURL)
	id := shortURL

	_, err := db.Exec(
		"INSERT INTO urls (id, original_url, short_url, creation_date) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
		id, originalURL, shortURL, time.Now(),
	)
	if err != nil {
		log.Printf("Insert error: %v", err)
	}

	return shortURL
}

func getURL(id string) (URL, error) {
	var url URL
	row := db.QueryRow("SELECT id, original_url, short_url, creation_date FROM urls WHERE id=$1", id)
	err := row.Scan(&url.ID, &url.OriginalURL, &url.ShortURL, &url.CreationDate)
	if err != nil {
		return URL{}, errors.New("URL not found")
	}
	return url, nil
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func RootPageURL(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	fmt.Fprintln(w, "API running successfully")
}

func ShortURLHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	var data struct {
		URL string `json:"url"`
	}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil || data.URL == "" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	shortURL := createURL(data.URL)
	response := struct {
		ShortURL string `json:"short_url"`
	}{ShortURL: shortURL}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func redirectURLHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	id := r.URL.Path[len("/"):]
	url, err := getURL(id)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusNotFound)
		return
	}
	http.Redirect(w, r, url.OriginalURL, http.StatusFound)
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/home", RootPageURL)
	http.HandleFunc("/shorten", ShortURLHandler)
	http.HandleFunc("/", redirectURLHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s...\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
