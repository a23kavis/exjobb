package main

import (
	"net/http"
	"os"
)

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Age      int    `json:"age"`
	Country  string `json:"country"`
	IsActive bool   `json:"isActive"`
}

func processHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok"}`))
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/process", processHandler)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	_ = server.ListenAndServe()
}
