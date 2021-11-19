package main

import (
	"log"
	"service/graph/generated"

	"github.com/arsmn/fastgql/graphql/handler"
	"github.com/arsmn/fastgql/graphql/playground"
	"github.com/valyala/fasthttp"
)

func main() {
	playground := playground.Handler("GraphQL playground", "/query")
	gqlHandler := handler.NewDefaultServer(generated.NewExecutableSchema(gql.NewResolver())).Handler()

	h := func(ctx *fasthttp.RequestCtx) {
		switch string(ctx.Path()) {
		case "/query":
			gqlHandler(ctx)
		case "/":
			playground(ctx)
		default:
			ctx.Error("not found", fasthttp.StatusNotFound)
		}
	}

	log.Fatal(fasthttp.ListenAndServe(":8080", h))
}
