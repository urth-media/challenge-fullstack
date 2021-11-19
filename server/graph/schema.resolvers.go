package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"service/graph/generated"
	"service/graph/model"
)

func (r *queryResolver) Items(ctx context.Context) ([]*model.Item, error) {
	resp, err := http.Get("https://hacker-news.firebaseio.com/v0/topstories.json")
	checkError(err)
	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)
	checkError(err)

	var items []model.Item
	json.Unmarshal(data, &items)

	for i := range items {
		r.items = append(r.items, &items[i])
	}

	return r.items, nil
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }

func checkError(err error) {
	if err != nil {
		log.Println(err)
	}
}
