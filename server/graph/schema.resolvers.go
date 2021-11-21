package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"service/graph/generated"
	"service/graph/model"
)

func (r *mutationResolver) CreateTodo(ctx context.Context, input model.NewTodo) (*model.Todo, error) {
	todo := &model.Todo{
		Text: input.Text,
		ID:   rand.Int(),
		User: nil,
	}
	r.todos = append(r.todos, todo)
	return todo, nil
}

func (r *queryResolver) Items(ctx context.Context, skip *int, take *int) ([]*model.Item, error) {
	resp, err := http.Get("https://hacker-news.firebaseio.com/v0/topstories.json")
	checkError(err)
	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)
	checkError(err)

	//var items []model.Item
	var items []int
	json.Unmarshal(data, &items)

	for i := range items[*skip:*take] {
		var item model.Item
		id := fmt.Sprintf("%d", items[i])

		storyResp, err := http.Get("https://hacker-news.firebaseio.com/v0/item/" + id + ".json")
		checkError(err)
		story, err := ioutil.ReadAll(storyResp.Body)
		checkError(err)

		json.Unmarshal(story, &item)

		//r.items = append(r.items, &items[i])
		r.items = append(r.items, &item)
		storyResp.Body.Close()
	}

	return r.items, nil
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Todos(ctx context.Context) ([]*model.Todo, error) {
	return r.todos, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func checkError(err error) {
	if err != nil {
		log.Println(err)
	}
}
