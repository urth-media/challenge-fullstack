package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	errorhandling "service/error"
	"service/graph/generated"
	"service/graph/model"
)

func (r *queryResolver) Items(ctx context.Context, page int) ([]*model.Item, error) {
	resp, err := http.Get("https://hacker-news.firebaseio.com/v0/topstories.json")
	errorhandling.CheckError(err)
	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)
	errorhandling.CheckError(err)

	var items []int
	json.Unmarshal(data, &items)

	r.items = nil
	pagNum := 1
	count := 0

	for i := range items {
		if count > 9 {
			count = 0
			pagNum += 1
		}

		var item model.Item
		id := fmt.Sprintf("%d", items[i])

		storyResp, err := http.Get("https://hacker-news.firebaseio.com/v0/item/" + id + ".json")
		errorhandling.CheckError(err)
		story, err := ioutil.ReadAll(storyResp.Body)
		errorhandling.CheckError(err)

		json.Unmarshal(story, &item)

		item.Page = pagNum

		if pagNum == page {
			// Build comment list
			for i := range item.Kids {
				var comment model.Comment

				urlComment := fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json", item.Kids[i])
				commentResp, err := http.Get(urlComment)
				errorhandling.CheckError(err)
				cmnt, err := ioutil.ReadAll(commentResp.Body)
				errorhandling.CheckError(err)
				json.Unmarshal(cmnt, &comment)

				fmt.Printf("comment: %s", comment.Text)

				item.Comments = append(item.Comments, &comment)
			}

			r.items = append(r.items, &item)
			fmt.Printf("%d, ", &item.ID)
		}

		if len(r.items) == 10 {
			break
		}

		storyResp.Body.Close()

		count += 1
	}

	return r.items, nil
}

func (r *queryResolver) Comments(ctx context.Context, parent int) ([]*model.Comment, error) {
	var item model.Item

	urlStory := fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json", parent)
	storyResp, err := http.Get(urlStory)
	errorhandling.CheckError(err)
	story, err := ioutil.ReadAll(storyResp.Body)
	errorhandling.CheckError(err)

	json.Unmarshal(story, &item)

	for i := range item.Kids {
		var comnt model.Comment

		urlComment := fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json", item.Kids[i])
		commentResp, err := http.Get(urlComment)
		errorhandling.CheckError(err)
		comment, err := ioutil.ReadAll(commentResp.Body)
		errorhandling.CheckError(err)

		json.Unmarshal(comment, &comnt)
		r.comments = append(r.comments, &comnt)
	}

	return r.comments, nil
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
