package grandprix

import (
	"appengine"
//	"appengine/datastore"
//	"encoding/json"
//	"fmt"
	"github.com/GoogleCloudPlatform/go-endpoints/endpoints"
	"github.com/mjibson/goon"
	"net/http"
	"time"
)

type Event struct {
	Key          string       `json:"key" datastore:"-" goon:"id"`
	EventDate    time.Time    `json:"eventdate" datastore:"eventdate"`
	Name         string       `json:"name" datastore:"name"`
	CurrentJson  string       `json:"currentjson" datastore:"currentjson"`
}

type GetSingleEventReq struct {
	Key string `json:"keyid"`
}

type PutSingleEventReq struct {
	//Event Event `json:"event"`
}

type SingleEventResp struct {
	Event Event `json:"event"`
}

func registerEventServices(api *endpoints.RPCService) {
	// TODO: List events
	// TODO: Add event
	// TODO: Delete event

	getevent := api.MethodByName("GetSingleEvent").Info()
	getevent.Name = "getsinglevent"
	getevent.HTTPMethod = "GET"
	getevent.Path = "event"
	getevent.Desc = "Get a single event"

	putevent := api.MethodByName("PutSingleEvent").Info()
	putevent.Name = "putsingleevent"
	putevent.HTTPMethod = "PUT"
	putevent.Path = "event"
	putevent.Desc = "Adds a test event"
}

// Get a single
func (ds *RootService) GetSingleEvent(
	r *http.Request,
	req *GetSingleEventReq,
	resp *SingleEventResp) error {

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)
	context.Infof("Req key %s", req.Key)
	id := req.Key
	context.Infof("Id %d", id)
	event := &Event{Key: id}
	err := n.Get(event)

	resp.Event = *event
	return err
}

// Add a single
func (ds *RootService) PutSingleEvent(
	r *http.Request,
	req *PutSingleEventReq,
	resp *SingleEventResp) error {

	// event := &req.Event
	event := &Event{Key:"Testevent", EventDate:time.Now(), Name:"Noget", CurrentJson:""}

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)
	_, err := n.Put(event)
	if err != nil {
		return err
	}
	id := event.Key
	context.Infof("Id %d", id)
	event = &Event{Key: id}
	err = n.Get(event)

	resp.Event = *event
	return err
}


// Update the current json string for the given event key
func updateCurrentJson(r *http.Request, eventkey string) {

	// Rebuild the entire event with races and teams in one json string a store in datastore and memcache



}
