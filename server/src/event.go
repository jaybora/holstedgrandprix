package grandprix

import (
	"appengine"
	"appengine/datastore"
	"encoding/json"
	//	"fmt"
	"github.com/GoogleCloudPlatform/go-endpoints/endpoints"
	"github.com/mjibson/goon"
	"net/http"
	"time"
)

type Event struct {
	Key         string    `json:"key" datastore:"-" goon:"id"`
	EventDate   time.Time `json:"eventdate" datastore:"eventdate"`
	Name        string    `json:"name" datastore:"name"`
	CurrentJson []byte    `json:"-" datastore:"currentjson"`
	CurrentJsonString string `json:"currentjson" datastore:"-"`
}

type EventForJson struct {
	Key       string        `json:"key"`
	EventDate time.Time     `json:"eventdate"`
	Name      string        `json:"name"`
	Races     []RaceForJson `json:"races"`
}

type GetSingleEventReq struct {
	Key string `json:"eventkey"`
}

type PutSingleEventReq struct {
	Event Event `json:"event"`
}

type SingleEventResp struct {
	Event Event `json:"event"`
}

type ListEventsReq struct {
}

type ListEventsResp struct {
	Events []Event `json:"events"`
}

func registerEventServices(api *endpoints.RPCService) {
	// TODO: Delete event

	getevent := api.MethodByName("GetSingleEvent").Info()
	getevent.Name = "getsingleevent"
	getevent.HTTPMethod = "GET"
	getevent.Path = "event"
	getevent.Desc = "Get a single event"

	putevent := api.MethodByName("PutSingleEvent").Info()
	putevent.Name = "putsingleevent"
	putevent.HTTPMethod = "PUT"
	putevent.Path = "event"
	putevent.Desc = "Add / overwrite an event"

	puttestevent := api.MethodByName("PutSingleTestEvent").Info()
	puttestevent.Name = "putsingletestevent"
	puttestevent.HTTPMethod = "PUT"
	puttestevent.Path = "eventtest"
	puttestevent.Desc = "Adds a test event"

	listevents := api.MethodByName("ListEvents").Info()
	listevents.Name = "listevents"
	listevents.HTTPMethod = "GET"
	listevents.Path = "events"
	listevents.Desc = "List all events"
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
	event.CurrentJsonString = string(event.CurrentJson)
	resp.Event = *event
	return err
}

// Add a single
func (ds *RootService) PutSingleTestEvent(
	r *http.Request,
	req *PutSingleEventReq,
	resp *SingleEventResp) error {

	event := Event{Key: "Testevent", EventDate: time.Now(), Name: "Noget", CurrentJson: []byte{}}

	return ds.PutSingleEvent(r, &PutSingleEventReq{Event: event}, resp)
}

// Add a single
func (ds *RootService) PutSingleEvent(
	r *http.Request,
	req *PutSingleEventReq,
	resp *SingleEventResp) error {

	event := &req.Event
	event.CurrentJson = []byte(event.CurrentJsonString)

	n := goon.NewGoon(r)
	_, err := n.Put(event)
	if err != nil {
		return err
	}
	event = &Event{Key: event.Key}
	err = n.Get(event)
	resp.Event = *event
	return err
}

func (ds *RootService) ListEvents(
	r *http.Request,
	req *ListEventsReq,
	resp *ListEventsResp) error {

	n := goon.NewGoon(r)
	events := &[]Event{}

	q := datastore.NewQuery("Event").Order("__key__")

	_, err := n.GetAll(q, events)

	resp.Events = *events
	return err
}

func EmptyToNil(in string) *string {
	if in == "" {
		return nil
	} else {
		return &in
	}
}

func EmptyTimeToNil(in time.Time) *time.Time {
	if in.IsZero() {
		return nil
	} else {
		return &in
	}
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

	racesJson := make([]RaceForJson, 0)
	for _, race := range races {
		racesJson = append(racesJson, RaceForJson{
			No:                 race.No,
			EventKey:           eventkey,
			Lane1Team:          ds.GetTeamAsJson(r, eventkey, race.Lane1TeamKey),
			Lane2Team:          ds.GetTeamAsJson(r, eventkey, race.Lane2TeamKey),
			Lane3Team:          ds.GetTeamAsJson(r, eventkey, race.Lane3TeamKey),
			Lane1RaceNo:        EmptyToNil(race.Lane1RaceNo),
			Lane2RaceNo:        EmptyToNil(race.Lane2RaceNo),
			Lane3RaceNo:        EmptyToNil(race.Lane3RaceNo),
			Place1Team:         ds.GetTeamAsJson(r, eventkey, race.Place1TeamKey),
			Place2Team:         ds.GetTeamAsJson(r, eventkey, race.Place2TeamKey),
			Place3Team:         ds.GetTeamAsJson(r, eventkey, race.Place3TeamKey),
			ScheduledStartTime: race.ScheduledStartTime,
			ActualStartTime:    EmptyTimeToNil(race.ActualStartTime),
			ActualEndTime:      EmptyTimeToNil(race.ActualEndTime),
			Note:               EmptyToNil(race.Note),
		})
	}

	eventJson := EventForJson{
		Key:       event.Key,
		EventDate: event.EventDate,
		Name:      event.Name,
		Races:     racesJson,
	}

	js, err := json.Marshal(eventJson)
	context.Debugf("JSON is %s", string(js))
	event.CurrentJsonString = string(js)

	// Save the json to memcache and datastore
	resp := &SingleEventResp{}
	ds.PutSingleEvent(r, &PutSingleEventReq{Event: event}, resp)

	context.Infof("Done rebuilding current json!")
	return nil
}
