angular.module('micro-finance')
	.factory('GlobalService', function ($q, $gapi) {
		var globalservice = {};
		var categories = null;
		var categoryMap = {};
		var stores = null;
		var storeMap = {};
		var userinfo = null;
		var loaded = false;
		var currentTicket = {};
		var promise;
		var gapi_dailyfinance;


		globalservice.setCategories = function(newcategories) {
			categories = newcategories;
			categoryMap = {}
			if (categories != null) {
				categories.sort(function(a, b) {
					return a.name.localeCompare(b.name)
				})
				categories.forEach(function(category) {
					categoryMap[category.id] = category;
				})			
			}
		}	

		globalservice.setStores = function(newstores) {
			stores = newstores;
			storeMap = {}
			if (stores != null) {
				stores.sort(function(a, b) {
					return a.name.localeCompare(b.name)
				})
				stores.forEach(function(store) {
					storeMap[store.id] = store;
				})
			}
		}	

        globalservice.loadBasisData = function (forceUpdate) {
        	if (loaded && !forceUpdate) {
        		console.log('Already loaded basisdata. Just returning what I have');
        		return promise;
        	}

        	loaded = true;
        	console.log("Now loading basisdata");

        	var authenticate = function() {
        		console.log('Authenticating...')
        		return $gapi.authed.then(function() {
        			console.log('Done authenticating');
            	}, function(reason) {
            		console.log('Failure on authenticate as %s', reason);
            	});
        	}

        	var getUserInfo = function() {
        		return $gapi.get_user_info().then(function(newuserinfo) {
        			userinfo = newuserinfo
        			console.log('User is %s', newuserinfo.email)
        		})
        	}

        	var loadApi = function() {
        		return $gapi.load('dailyfinance', 'v1', true).then(function() {
        			console.log('Done loading API');
        			gapi_dailyfinance = $gapi.client.dailyfinance;
        		});
        	}

            var loadCategories = function() {
       			console.log('Now loading categories');
				return $gapi.client.dailyfinance.listcategories().then(function(resp) {
					globalservice.setCategories(resp.categories);
					console.log('Finished loading categories.');
					if (resp.categories == null) {
						console.log('There was no categories');
					} else {
						console.log('There was %d categories', 
							resp.categories.length);
					}
				})
			};

			var loadStores = function() {
				console.log('Now loading stores');
				return $gapi.client.dailyfinance.liststores().then(function(resp) {
					globalservice.setStores(resp.stores);
					console.log('Finished loading stores.');
					if (resp.stores == null) {
						console.log('There was no stores');
					} else {
						console.log('There was %d stores', 
							resp.stores.length);
					}
				})	
			};

            
            promise = authenticate()
                .then(function() {
                	return getUserInfo()
                })
	            .then(function() {
	            	return loadApi()
	            })
				.then(function() {
					
					return $q.all([loadCategories(), loadStores()])
				})
			return promise;
        };

		globalservice.getStores = function() {
				return stores;
		};
		globalservice.getCategories = function() {
				return categories;
		}	

		globalservice.getStoreMap = function() {
				return storeMap;
		};
		globalservice.getCategoryMap = function() {
				return categoryMap
		}

		globalservice.getGapiDailyfinance = function() {
			return gapi_dailyfinance;
		}

		globalservice.getUserInfo = function() {
			return userinfo;
		}

		globalservice.signin = function() {
			return $gapi.signin(false).then(function() {
				console.log('Signin went well')
			}, function() {
				console.log('Signin was not successfull');
			});
		}

		globalservice.getCurrentTicket = function() {
			return currentTicket;
		}

		globalservice.setCurrentTicket = function(ticket) {
			currentTicket = ticket;
		}
		
		return globalservice;

	})