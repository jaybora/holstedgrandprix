angular.module('grandprix')
        .factory('GlobalService', function ($q, GApi) {
            var currenteventkey = "Testevent";
            var globalservice = {};
            var event = null;
            var teams = null;
            var teamMap = {};
            var races = null;
            var raceMap = {};
            // var categories = null;
            // var categoryMap = {};
            // var stores = null;
            // var storeMap = {};
            // var userinfo = null;
            // var loaded = false;
            // var currentTicket = {};
//            var promise;
//            var gapi_grandprix;


            globalservice.setRaces = function (newraces) {
                races = newraces;
                raceMap = {}
                if (races != null) {
                    races.sort(function (a, b) {
                        return a.no.localeCompare(b.no)
                    })
                    races.forEach(function (race) {
                        raceMap[race.no] = race;
                    })
                }
            }

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
                return races;
            }

//            globalservice.loadCurrentJson = function () {
            // if (loaded && !forceUpdate) {
            // 	console.log('Already loaded basisdata. Just returning what I have');
            // 	return promise;
            // }

            // loaded = true;
//                console.log("Now loading current json");

            // var authenticate = function() {
            // 	console.log('Authenticating...')
            // 	return $gapi.authed.then(function() {
            // 		console.log('Done authenticating');
            //    	}, function(reason) {
            //    		console.log('Failure on authenticate as %s', reason);
            //    	});
            // }

            // var getUserInfo = function() {
            // 	return $gapi.get_user_info().then(function(newuserinfo) {
            // 		userinfo = newuserinfo
            // 		console.log('User is %s', newuserinfo.email)
            // 	})
            // }

//                var loadApi = function () {
//                    return $GApi.execute('grandprix', 'v1', true).then(function () {
//                        console.log('Done loading API');
//                        gapi_grandprix = $gapi.client.grandprix;
//                    });
//                };

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

            var loadRaces = function () {
                console.log('Now loading races');
                return GApi.execute('grandprix', 'listraces', {eventkey: currenteventkey}).then(function (resp) {
                    console.log('Finished loading races.');
                    globalservice.setRaces(resp.races);
                    if (resp.races === null) {
                        console.log('There was no races');
                    } else {
                        console.log('There was %d races', resp.races.length);
                    }
                });
            };

            globalservice.fetchTeamsAndRaces = function () {
                return $q.all([loadTeams(), loadRaces(), globalservice.fetchEvent()]);
            };
//                promise = loadApi()
//                        // authenticate()
//                        // .then(function() {
//                        // 	return getUserInfo()
//                        // })
//                        // .then(function() {
//                        // 	return loadApi()
//                        // })
//                        .then(function () {
//                            return $q.all([loadIt]);
//                        });
//                return promise;
//            };

            globalservice.fetchEvent = function () {
                console.log("Fetching event...");
                return GApi.execute('grandprix', 'getsingleevent', {eventkey: currenteventkey}).then(function (resp) {
                    event = resp.event;
                    if (event.currentjson !== null && event.currentjson.length > 0) {
                        event.currentjson = JSON.parse(resp.event.currentjson);
                    }
                    console.log("Got the event as: " + event);
                }, function () {
                    console.log("error on getting current json");
                });
            };

            globalservice.getEvent = function () {
                return event;
            }
            // globalservice.getCategories = function() {
            // 		return categories;
            // }

            // globalservice.getStoreMap = function() {
            // 		return storeMap;
            // };
            // globalservice.getCategoryMap = function() {
            // 		return categoryMap
            // }

            // globalservice.getGapiDailyfinance = function() {
            // 	return gapi_dailyfinance;
            // }

            // globalservice.getUserInfo = function() {
            // 	return userinfo;
            // }

            // globalservice.signin = function() {
            // 	return $gapi.signin(false).then(function() {
            // 		console.log('Signin went well')
            // 	}, function() {
            // 		console.log('Signin was not successfull');
            // 	});
            // }

            // globalservice.getCurrentTicket = function() {
            // 	return currentTicket;
            // }

            // globalservice.setCurrentTicket = function(ticket) {
            // 	currentTicket = ticket;
            // }

            return globalservice;

        });