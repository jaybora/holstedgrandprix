angular.module('grandprix', ['ngRoute', 'ngAnimate', 'angular-google-gapi', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {    
        $routeProvider.when('/frontpage', {templateUrl: 'partials/frontpage.html', controller: 'FrontpageCtrl'});
        $routeProvider.when('/program', {templateUrl: 'partials/program.html', controller: 'ProgramCtrl'});
        $routeProvider.when('/rules', {templateUrl: 'partials/rules.html'});
        $routeProvider.when('/2015', {templateUrl: 'partials/2015.html'});
        $routeProvider.otherwise({redirectTo: 'frontpage'});
    }])
    .run(['GApi', 'GAuth', function(GApi, GAuth) {
        var BASE = '/_ah/api';
        GApi.load('grandprix','v1',BASE).then(function(resp) {
            console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
        }, function(resp) {
            console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
        });
    }])
    .filter('yesNo', function() {
        return function(input) {
            return input ? 'Ja' : 'Nej';
        };
    })
            .filter('raceStatus', function() {
                return function(race) {
                    if (race.actualstarttime == null) {
                        return 'Afventer';
                    } else {
                        if (race.actualendtime !== null) {
                            return 'Køres nu!';
                        } else {
                            return 'Kørt';
                        }
                        
                    }
                };
    })
            .filter('raceStatusImg', function() {
                return function(race) {
                    if (race.actualstarttime == null) {
                        return 'sleep.png';
                    } else {
                        if (race.actualendtime == null) {
                            return 'racecar.png';
                        } else {
                            return 'flag.png';
                        }
                        
                    }
                };
    })          
            .filter('raceStatusClass', function() {
                return function(race) {
                    if (race.actualstarttime == null) {
                        return '';
                    } else {
                        if (race.actualendtime == null) {
                            return 'info';
                        } else {
                            return 'success';
                        }
                        
                    }
                };
    })
            .filter('placeText', function() {
                return function(laneteam, race) {
                    if (laneteam == null) {
                        return null;
                    } else if (race.place1team != null && laneteam.teamkey === race.place1team.teamkey) {
                        return "1. plads";
                    } else if (race.place2team != null && laneteam.teamkey === race.place2team.teamkey) {
                        return "2. plads";
                    } else if (race.place3team != null && laneteam.teamkey === race.place3team.teamkey) {
                        return "3. plads";
                    } else {
                        return null;
                    }
                };
    })
    
;
    

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
