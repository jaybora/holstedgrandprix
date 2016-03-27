package grandprix

import (
	"appengine"
	"appengine/datastore"
	"github.com/GoogleCloudPlatform/go-endpoints/endpoints"
	"github.com/mjibson/goon"
	"net/http"
)

type Team struct {
	EventKeyForGoon *datastore.Key `json:"-" datastore:"-" goon:"parent"`
	EventKey        string         `json:"eventkey" datastore:"-"`
	Key             string         `json:"teamkey" datastore:"-" goon:"id"`
	Name            string         `json:"name" datastore:"name"`
}

type TeamForJson struct {
	Key  string `json:"key"`
	Name string `json:"name"`
}

type GetSingleTeamReq struct {
	Key      string `json:"teamkey"`
	EventKey string `json:"eventkey"`
}

type PutSingleTeamReq struct {
	Team Team `json:"team"`
}

type ListTeamsReq struct {
	EventKey string `json:"eventkey"`
}

type ListTeamsResp struct {
	Teams []Team `json:"teams"`
}

type SingleTeamResp struct {
	Team Team `json:"team"`
}

type DeleteSingleTeamResp struct{}

func registerTeamServices(api *endpoints.RPCService) {
	// Get single team
	single := api.MethodByName("GetSingleTeam").Info()
	single.Name = "getsingleteam"
	single.HTTPMethod = "GET"
	single.Path = "team"
	single.Desc = "Get a single team"

	list := api.MethodByName("ListTeams").Info()
	list.Name = "listteams"
	list.HTTPMethod = "GET"
	list.Path = "teams"
	list.Desc = "List all teams for given event"

	put := api.MethodByName("PutSingleTeam").Info()
	put.Name = "putsingleteam"
	put.HTTPMethod = "PUT"
	put.Path = "team"
	put.Desc = "Put a single team"

	puttest := api.MethodByName("PutSingleTeamTest").Info()
	puttest.Name = "putsingleteamtest"
	puttest.HTTPMethod = "PUT"
	puttest.Path = "teamtest"
	puttest.Desc = "Put a single test team"

	del := api.MethodByName("DeleteTeam").Info()
	del.Name = "deleteteam"
	del.HTTPMethod = "DELETE"
	del.Path = "team"
	del.Desc = "Delete a team"

}

// Get a single
func (ds *RootService) GetSingleTeam(
	r *http.Request,
	req *GetSingleTeamReq,
	resp *SingleTeamResp) error {

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)
	eventKeyForGoon := datastore.NewKey(context, "Event", req.EventKey, 0, nil)
	context.Infof("Req key %s, eventkey %s", req.Key, req.EventKey)
	team := &Team{Key: req.Key, EventKeyForGoon: eventKeyForGoon}
	team.EventKey = team.EventKeyForGoon.StringID()

	err := n.Get(team)

	resp.Team = *team
	return err
}

// List for given key
func (ds *RootService) ListTeams(
	r *http.Request,
	req *ListTeamsReq,
	resp *ListTeamsResp) error {

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)
	context.Infof("Eventid %s", req.EventKey)
	eventkey := datastore.NewKey(context, "Event", req.EventKey, 0, nil)
	teams := &[]Team{}
	q := datastore.NewQuery("Team").Ancestor(eventkey).Order("name")

	_, err := n.GetAll(q, teams)

	for index, _ := range *teams {
		(*teams)[index].EventKey = (*teams)[index].EventKeyForGoon.StringID()
	}

	resp.Teams = *teams
	return err
}

// Put a single
func (ds *RootService) PutSingleTeam(
	r *http.Request,
	req *PutSingleTeamReq,
	resp *SingleTeamResp) error {

	context := appengine.NewContext(r)

	eventkey := datastore.NewKey(context, "Event", req.Team.EventKey, 0, nil)
	team := &req.Team
	team.EventKeyForGoon = eventkey

	n := goon.NewGoon(r)
	_, err := n.Put(team)
	if err != nil {
		return err
	}
	team = &Team{Key: team.Key, EventKeyForGoon: eventkey}
	err = n.Get(team)

	resp.Team = *team

	ds.UpdateCurrentJson(r, req.Team.EventKey)

	return err
}

func (ds *RootService) PutSingleTeamTest(
	r *http.Request,
	req *PutSingleTeamReq,
	resp *SingleTeamResp) error {

	req.Team = Team{EventKey: "Testevent", Key: "Testteam", Name: "Testteam"}

	return ds.PutSingleTeam(r, req, resp)
}

func (ds *RootService) GetTeamAsJson(r *http.Request, eventkey string, teamkey string) *TeamForJson {
	if teamkey == "" {
		return nil
	}
	resp := &SingleTeamResp{}
	context := appengine.NewContext(r)
	err := ds.GetSingleTeam(r, &GetSingleTeamReq{Key: teamkey, EventKey: eventkey}, resp)
	if err != nil {
		context.Errorf("Could not find Team with keyid %s and eventkey %s for json!", teamkey, eventkey)
		return nil
	}

	return &TeamForJson{Key: resp.Team.Key, Name: resp.Team.Name}

}

func (ds *RootService) DeleteTeam(
	r *http.Request,
	req *GetSingleTeamReq,
	resp *DeleteSingleTeamResp) error {

	context := appengine.NewContext(r)
	n := goon.NewGoon(r)

	eventkey := datastore.NewKey(context, "Event", req.EventKey, 0, nil)
	key := datastore.NewKey(context, "Team", req.Key, 0, eventkey)

	return n.Delete(key)
}
