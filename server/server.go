package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"runtime/debug"
	"service/graph"
	"service/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/rs/cors"
)

func main() {
	router := chi.NewRouter()

	// Add CORS middleware around every request
	// See https://github.com/rs/cors for full option listing
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8081", "http://localhost:8080"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))
	srv.SetRecoverFunc(func(ctx context.Context, err interface{}) (userMessage error) {
		// send this panic somewhere
		log.Print(err)
		debug.PrintStack()
		return errors.New("user message on panic")
	})

	//http.Handle("/", playground.Handler("Todo", "/query"))

	// http.Handle("/", playground.Handler("Item", "/query"))
	// http.Handle("/query", srv)
	router.Handle("/", playground.Handler("Item", "/query"))
	router.Handle("/query", srv)

	//log.Fatal(http.ListenAndServe(":8081", nil))
	log.Fatal(http.ListenAndServe(":8081", router))
}
