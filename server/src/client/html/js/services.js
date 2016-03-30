angular.module('grandprix')
        .factory('GlobalService', function ($q, GApi) {
            var currenteventkey = "Testevent";
            var globalservice = {};
            var event = null;
            // var categories = null;
            // var categoryMap = {};
            // var stores = null;
            // var storeMap = {};
            // var userinfo = null;
            // var loaded = false;
            // var currentTicket = {};
//            var promise;
//            var gapi_grandprix;


            // globalservice.setCategories = function(newcategories) {
            // 	categories = newcategories;
            // 	categoryMap = {}
            // 	if (categories != null) {
            // 		categories.sort(function(a, b) {
            // 			return a.name.localeCompare(b.name)
            // 		})
            // 		categories.forEach(function(category) {
            // 			categoryMap[category.id] = category;
            // 		})			
            // 	}
            // }	

            // globalservice.setStores = function(newstores) {
            // 	stores = newstores;
            // 	storeMap = {}
            // 	if (stores != null) {
            // 		stores.sort(function(a, b) {
            // 			return a.name.localeCompare(b.name)
            // 		})
            // 		stores.forEach(function(store) {
            // 			storeMap[store.id] = store;
            // 		})
            // 	}
            // }	

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

//                var loadIt = function () {
//                    console.log('Now loading current json');
//                    return $gapi.client.grandprix.getsinglevent({eventkey:currenteventkey}).then(function (resp) {
//                        currentJson = resp.event;
//                        console.log('Finished loading current json.');
//                        if (resp.event === null) {
//                            console.log('There was no categories');
//                        } else {
//                            console.log('There was %d races',
//                                    resp.event.races.length);
//                        }
//                    });
//                };
//
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
                return GApi.execute('grandprix', 'getsingleevent', {eventkey: currenteventkey}).then( function(resp) {
                    event = resp.event;
                    event.currentjson = JSON.parse(resp.event.currentjson);
                    console.log("Got the event as: " + event);
                }, function() {
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