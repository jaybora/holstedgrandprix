package grandprix

import (
	"appengine"
	"appengine/datastore"
	"github.com/GoogleCloudPlatform/go-endpoints/endpoints"
	"github.com/mjibson/goon"
	"net/http"
	"time"
)

type Race struct {
	EventKeyForGoon    *datastore.Key `json:"-" datastore:"-" goon:"parent"`
	EventKey           string         `json:"eventkey" datastore:"-"`
	No                 string         `json:"no" datastore:"-" goon:"id"`
	Lane1TeamKey       string         `json:"lane1teamkey" datastore:"lane1teamkey"`
	Lane2TeamKey       string         `json:"lane2teamkey" datastore:"lane2teamkey"`
	Lane3TeamKey       string         `json:"lane3teamkey" datastore:"lane3teamkey"`
	Lane1RaceNo        string         `json:"lane1raceno" datastore:"lane1raceno"`
	Lane2RaceNo        string         `json:"lane2raceno" datastore:"lane2raceno"`
	Lane3RaceNo        string         `json:"lane3raceno" datastore:"lane3raceno"`
	Place1TeamKey      string         `json:"place1teamkey" datastore:"place1teamkey"`
	Place2TeamKey      string         `json:"place2teamkey" datastore:"place2teamkey"`
	Place3TeamKey      string         `json:"place3teamkey" datastore:"place3teamkey"`
	ScheduledStartTime time.Time      `json:"scheduledstarttime", datastore:"scheduledstarttime"`
	ActualStartTime    time.Time      `json:"actualstarttime" datastore:"actualstarttime"`
	ActualEndTime      time.Time      `json:"actualendtime" datastore:"actualendtime"`
	Note               string         `json:"note" datastore:"note"`
}

type RaceForJson struct {
	No                 string       `json:"no"`
	Lane1Team          *TeamForJson `json:"lane1team,omitempty"`
	Lane2Team          *TeamForJson `json:"lane2team,omitempty"`
	Lane3Team          *TeamForJson `json:"lane3team,omitempty"`
	Lane1RaceNo        *string      `json:"lane1raceno,omitempty"`
	Lane2RaceNo        *string      `json:"lane2raceno,omitempty"`
	Lane3RaceNo        *string      `json:"lane3raceno,omitempty"`
	Place1Team         *TeamForJson `json:"place1team,omitempty"`
	Place2Team         *TeamForJson `json:"place2team,omitempty"`
	Place3Team         *TeamForJson `json:"place3team,omitempty"`
	ScheduledStartTime time.Time    `json:"scheduledstarttime,omitempty"`
	ActualStartTime    *time.Time   `json:"actualstarttime,omitempty"`
	ActualEndTime      *time.Time   `json:"actualendtime,omitempty"`
	Note               *string      `json:"note,omitempty"`
}

type GetSingleRaceReq struct {
	No       string `json:"no"`
	EventKey string `json:"eventkey"`
}

type PutSingleRaceReq struct {
	Race Race `json:"race"`
}

type ListRacesReq struct {
	EventKey string `json:"eventkey"`
}

type ListRacesResp struct {
	Races []Race `json:"races"`
}

type SingleRaceResp struct {
	Race Race `json:"race"`
}

type DeleteSingleRaceResp struct {
}

func registerRaceServices(api *endpoints.RPCService) {
	// Get single Race
	single := api.MethodByName("GetSingleRace").Info()
	single.Name = "getsinglerace"
	single.HTTPMethod = "GET"
	single.Path = "race"
	single.Desc = "Get a single Race"

	list := api.MethodByName("ListRaces").Info()
	list.Name = "listraces"
	list.HTTPMethod = "GET"
	list.Path = "races"
	list.Desc = "List all Races for given event"

	put := api.MethodByName("PutSingleRace").Info()
	put.Name = "putsinglerace"
	put.HTTPMethod = "PUT"
	put.Path = "race"
	put.Desc = "Put a single race"

	puttest := api.MethodByName("PutSingleRaceTest").Info()
	puttest.Name = "putsingleracetest"
	puttest.HTTPMethod = "PUT"
	puttest.Path = "racetest"
	puttest.Desc = "Put a single test Race on Testevent"

	del := api.MethodByName("DeleteRace").Info()
	del.Name = "deleterace"
	del.HTTPMethod = "DELETE"
	del.Path = "race"
	del.Desc = "Delete a race"
}

// Get a single
func (ds *RootService) GetSingleRace(
	r *http.Request,
	req *GetSingleRaceReq,
	resp *SingleRaceResp) error {

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)
	eventKeyForGoon := datastore.NewKey(context, "Event", req.EventKey, 0, nil)
	context.Infof("Req no %s, eventkey %s", req.No, req.EventKey)
	race := &Race{No: req.No, EventKeyForGoon: eventKeyForGoon}
	race.EventKey = race.EventKeyForGoon.StringID()

	err := n.Get(race)

	resp.Race = *race
	return err
}

// List for given key
func (ds *RootService) ListRaces(
	r *http.Request,
	req *ListRacesReq,
	resp *ListRacesResp) error {

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)
	context.Infof("Eventid %s", req.EventKey)
	eventkey := datastore.NewKey(context, "Event", req.EventKey, 0, nil)
	races := &[]Race{}
	q := datastore.NewQuery("Race").Ancestor(eventkey).Order("__key__")

	_, err := n.GetAll(q, races)

	for index, _ := range *races {
		(*races)[index].EventKey = (*races)[index].EventKeyForGoon.StringID()
	}

	resp.Races = *races
	return err
}

// Put a single
func (ds *RootService) PutSingleRace(
	r *http.Request,
	req *PutSingleRaceReq,
	resp *SingleRaceResp) error {

	context := appengine.NewContext(r)

	eventkey := datastore.NewKey(context, "Event", req.Race.EventKey, 0, nil)
	race := &req.Race
	race.EventKeyForGoon = eventkey

	n := goon.NewGoon(r)
	_, err := n.Put(race)
	if err != nil {
		return err
	}
	race = &Race{No: race.No, EventKeyForGoon: eventkey}
	err = n.Get(race)

	resp.Race = *race

	ds.UpdateCurrentJson(r, req.Race.EventKey)

	return err
}

func (ds *RootService) PutSingleRaceTest(
	r *http.Request,
	req *PutSingleRaceReq,
	resp *SingleRaceResp) error {

	req.Race = Race{EventKey: "Testevent", No: "01", ScheduledStartTime: time.Now()}

	return ds.PutSingleRace(r, req, resp)
}

func (ds *RootService) DeleteRace(
	r *http.Request,
	req *GetSingleRaceReq,
	resp *DeleteSingleRaceResp) error {

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)

	eventkey := datastore.NewKey(context, "Event", req.EventKey, 0, nil)
	key := datastore.NewKey(context, "Race", req.No, 0, eventkey)

	return n.Delete(key)
}
