package grandprix

import (
	"appengine"
//	"appengine/datastore"
	"encoding/json"
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

type EventForJson struct {
	Key string `json:"key"`
	EventDate time.Time `json:"eventdate"`
	Name string `json:"name"`
	Races []RaceForJson `json:"races"`
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
	event := &Event{Key: req.Key}
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

	n := goon.NewGoon(r)
	_, err := n.Put(event)
	if err != nil {
		return err
	}
	event = &Event{Key: event.Key}
	err = n.Get(event)

	resp.Event = *event
	ds.UpdateCurrentJson(r, event.Key)
	return err
}


// Update the current json string for the given event key
func (ds *RootService) UpdateCurrentJson(r *http.Request, eventkey string) error {
	context := appengine.NewContext(r)	
	// Rebuild the entire event with races and teams in one json string a store in datastore and memcache
	context.Infof("Rebuilding current json...")

	// Start with the event
	eventresp := &SingleEventResp{}
	err := ds.GetSingleEvent(r, &GetSingleEventReq{Key: eventkey}, eventresp)
	if err != nil {
		return err
	}
	event := eventresp.Event

	// Find races
	racesresp := &ListRacesResp{}
	err = ds.ListRaces(r, &ListRacesReq{EventKey: eventkey}, racesresp)
	if err != nil {
		return err
	}
	races := racesresp.Races

	racesJson := make([]RaceForJson, len(races))
	for _, race := range races {
		racesJson = append(racesJson, RaceForJson{
				No: race.No,
			})
	}

	eventJson := EventForJson {
		Key: event.Key,
		EventDate: event.EventDate,
		Name: event.Name,
		Races: racesJson,
	}

	js, err := json.Marshal(eventJson)
	context.Infof("JSON is %s", string(js))


	context.Infof("Done rebuilding current json!")
	return nil
}
