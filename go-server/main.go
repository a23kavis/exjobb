package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"os"
	"sort"
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

func hashPassword(password string) string {
	sum := sha256.Sum256([]byte(password))
	return hex.EncodeToString(sum[:])
}

func processUsers(users []User) []User {
	filtered := make([]User, 0, len(users))

	for _, user := range users {
		if user.ID%2 != 0 {
			filtered = append(filtered, user)
		}
	}

	sort.Slice(filtered, func(i, j int) bool {
		return filtered[i].Name < filtered[j].Name
	})

	for i := range filtered {
		filtered[i].Password = hashPassword(filtered[i].Password)
	}

	return filtered
}

func processHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var users []User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&users); err != nil || users == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_, _ = w.Write([]byte(`{"error":"Request body must be a JSON array."}`))
		return
	}

	processed := processUsers(users)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(processed)
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
