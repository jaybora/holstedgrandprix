angular.module('grandprix', ['ngRoute', 'ngAnimate', 'angular-google-gapi', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/frontpage', {templateUrl: 'partials/frontpage.html', controller: 'FrontpageCtrl'});
        $routeProvider.when('/dayprogram', {templateUrl: 'partials/dayprogram.html'});
        $routeProvider.when('/program', {templateUrl: 'partials/program.html', controller: 'ProgramCtrl'});
        $routeProvider.when('/programtest', {templateUrl: 'partials/programtest.html', controller: 'ProgramCtrl'});
        $routeProvider.when('/rules', {templateUrl: 'partials/rules.html'});
        $routeProvider.when('/2015', {templateUrl: 'partials/2015.html'});
        $routeProvider.otherwise({redirectTo: 'dayprogram'});
    }])
    .run(['GApi', 'GAuth', function(GApi, GAuth) {
        var BASE = '/_ah/api';
        GApi.load('grandprix','v1',BASE).then(function(resp) {
            console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
        }, function(resp) {
            console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
        });
    }])
    .directive('countdown', [
        'Util',
        '$interval',
        function (Util, $interval) {
            return {
                restrict: 'A',
                scope: { date: '@' },
                link: function (scope, element) {
                    var future;
                    future = new Date(scope.date);
                    $interval(function () {
                        var diff;
                        diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                        return element.text(Util.dhms(diff));
                    }, 1000);
                }
            };
        }
    ])
    .factory('Util', [function () {
            return {
                dhms: function (t) {
                    var days, hours, minutes, seconds;
                    days = Math.floor(t / 86400);
                    t -= days * 86400;
                    hours = Math.floor(t / 3600) % 24;
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    seconds = t % 60;
                    return [
                        days + ' dage',
                        hours + ' timer',
                        minutes + ' minutter',
                        seconds + ' sekunder'
                    ].join(' ');
                }
            };
        }
    ])
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
                            return 'race_clipped.png';
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
            .filter('placement', ['GlobalService', function(GlobalService) {
                return function(laneteam, laneraceno, race) {
                    var laneteamkey;
                    if (laneraceno != null && GlobalService.getRacesMap()[laneraceno] != null &&
                            GlobalService.getRacesMap()[laneraceno].place1team != null) {
                        laneteamkey = GlobalService.getRacesMap()[laneraceno].place1team.key;
                    } else if (laneteam != null) {
                        laneteamkey = laneteam.key;
                    } else {
                        return null;
                    }

                    if (race.place1team != null && laneteamkey === race.place1team.key) {
                        return 1;
                    } else if (race.place2team != null && laneteamkey === race.place2team.key) {
                        return 2;
                    } else if (race.place3team != null && laneteamkey === race.place3team.key) {
                        return 3;
                    } else {
                        return null;
                    }
                };
    }])
            .filter('winnerTeam', ['GlobalService', function(GlobalService) {
                return function(raceno) {
                    var racesMap = GlobalService.getRacesMap();
                    if (raceno !== null && racesMap[raceno] != null && racesMap[raceno].place1team != null) {
                        return racesMap[raceno].place1team.name;
                    } else {
                        return "Vinder af løb " + raceno;
                    }
                };
    }])

;


function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
