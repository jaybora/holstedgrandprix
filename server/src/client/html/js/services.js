angular.module('grandprix')
        .factory('GlobalService', function ($q, GApi) {
            var currenteventkey = "Testevent";
            var globalservice = {};
            var event = null;
            var teams = null;
            var teamMap = {};
            var racesMap = {};

            globalservice.setTeams = function (newteams) {
                teams = newteams;
                teamMap = {}
                if (teams != null) {
                    teams.sort(function (a, b) {
                        return a.teamkey.localeCompare(b.teamkey)
                    })
                    teams.forEach(function (team) {
                        teamMap[team.teamkey] = team;
                    })
                }
            }

            globalservice.getTeams = function () {
                return teams;
            }

            globalservice.getRaces = function () {
                if (event.currentjson != null) {
                    return event.currentjson.races;
                } else {
                    return null;
                }
            }

            globalservice.getRacesMap = function () {
                return racesMap;
            }

            var loadTeams = function () {
                console.log('Now loading teams');
                return GApi.execute('grandprix', 'listteams', {eventkey: currenteventkey}).then(function (resp) {
                    console.log('Finished loading teams.');
                    globalservice.setTeams(resp.teams);
                    if (resp.teams === null) {
                        console.log('There was no teams');
                    } else {
                        console.log('There was %d teams', resp.teams.length);
                    }
                });
            };


            globalservice.fetchTeamsAndRaces = function () {
                return $q.all([loadTeams(), globalservice.fetchEvent()]);
            };

            globalservice.fetchEvent = function () {
                console.log("Fetching event...");
                return GApi.execute('grandprix', 'getsingleevent', {eventkey: currenteventkey}).then(function (resp) {
                    event = resp.event;
                    if (event.currentjson !== null && event.currentjson.length > 0) {
                        event.currentjson = JSON.parse(resp.event.currentjson);

                        // Build the races map
                        event.currentjson.races.forEach(function (race) {
                            racesMap[race.no] = race;
                        });
                    }
                    console.log("Got the event as: %o", event);
                }, function () {
                    console.log("error on getting current json");
                });
            };

            globalservice.getEvent = function () {
                return event;
            }

            return globalservice;

        });