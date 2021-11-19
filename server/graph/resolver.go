//go:generate go run github.com/arsmn/fastgql
package graph

import "service/graph/model"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	items []*model.Item
	users []*model.User
}
