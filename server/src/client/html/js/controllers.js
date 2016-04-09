'use strict';

function init() {
    console.log("Init");
    //window.init();
    var scope = angular.element(document.getElementById("thebody")).scope();
    scope.$apply(function () {
        scope.load_microfinance_lib();
    })
}

angular.module('grandprix').
        controller('LandingCtrl', ['$scope', '$location',
            function ($scope, $location) {
                $scope.isActive = function (path) {
                    return ($location.path().substr(0, path.length) == path);
                }

            }]).
        controller('FrontpageCtrl', ['$scope',
            function ($scope) {
                $scope.slides = [{image: 'images/1.jpg', text: 'Det tradionsrige sæbekasseløb ved Holsted Skole', id: 0},
                    {image: 'images/2.jpg', text: 'Er tilbage igen den 27. maj 2016', id: 1}]

            }]).
        controller('ProgramCtrl', ['$scope', 'GlobalService', '$timeout', '$uibModal', 'GApi', '$location',
            function ($scope, GlobalService, $timeout, $uibModal, GApi) {
                $scope.loading = true;
                $scope.blinkerVisible  = true;
                $scope.loadEvent = function (autoupdate) {
                    if (autoupdate) {
                       $timeout(function() {$scope.loadEvent(true);}, 10000);
                    }
                    return GlobalService.fetchEvent().then(function () {
                        console.log("The controller got the event done");
                        $scope.event = GlobalService.getEvent();
                        if ($scope.event !== null) {
                            $scope.event.currentjson.races.forEach(function (race) {
                                mapToDatastoreFormat(race);
                            });
                        }
                        $scope.loading = false;
                    }, function (reason) {
                        console.log("Could not load program for event. Reason: " + reason);
                        $scope.loading = false;
                    });

                };


                function mapToDatastoreFormat(race) {
                    race.eventkey = $scope.event.key;
                    if (race.lane1team != null) {
                        race.lane1teamkey = race.lane1team.key;
                    }
                    if (race.lane2team != null) {
                        race.lane2teamkey = race.lane2team.key;
                    }
                    if (race.lane3team != null) {
                        race.lane3teamkey = race.lane3team.key;
                    }
                    if (race.place1team != null) {
                        race.place1teamkey = race.place1team.key;
                    }
                    if (race.place2team != null) {
                        race.place2teamkey = race.place2team.key;
                    }
                    if (race.place3team != null) {
                        race.place3teamkey = race.place3team.key;
                    }
                }

                $scope.loadEvent(true);

                $scope.startrace = function (race) {
                    race.actualstarttime = new Date();
                    mapToDatastoreFormat(race);
                    GApi.execute('grandprix', 'putsinglerace', {race: race})
                            .then(function (resp) {
                                $scope.loadEvent(false);
                            });
                };

                $scope.cancelstart = function (race) {
                    race.actualstarttime = new Date("0001-01-01T00:00:00Z");
                    mapToDatastoreFormat(race);
                    GApi.execute('grandprix', 'putsinglerace', {race: race})
                            .then(function (resp) {
                                $scope.loadEvent(false);
                            });
                };

                $scope.cancelend = function (race) {
                    race.actualendtime = new Date("0001-01-01T00:00:00Z");
                    mapToDatastoreFormat(race);
                    GApi.execute('grandprix', 'putsinglerace', {race: race})
                            .then(function (resp) {
                                $scope.loadEvent(false);
                            });
                };

                function checkForFinish(race) {
                    if ((race.lane1teamkey == null && race.lane1raceno == null || race.place1teamkey != null) &&
                            (race.lane2teamkey == null && race.lane2raceno == null || race.place2teamkey != null) &&
                            (race.lane3teamkey == null && race.lane3raceno == null || race.place3teamkey != null)) {
                        race.actualendtime = new Date();
                    }
                }

                function removePlaceForTeam(race, laneteamkey) {
                    if (race.place1teamkey == laneteamkey) {
                        race.place1team = null;
                        race.place1teamkey = null;
                    } else if (race.place2teamkey == laneteamkey) {
                        race.place2team = null;
                        race.place2teamkey = null;
                    } else if (race.place3teamkey == laneteamkey) {
                        race.place3teamkey = null;
                        race.place3team = null;
                    }
                }

                $scope.pos1 = function(laneteam, laneraceno, race) {
                    mapToDatastoreFormat(race);
                    if (laneraceno != null) {
                        // Take the winner team from the raceno
                        race.place1teamkey = GlobalService.getRacesMap()[laneraceno].place1team.key;
                    } else {
                        removePlaceForTeam(race, laneteam.key);
                        race.place1teamkey = laneteam.key;
                    }
                    checkForFinish(race);
                    GApi.execute('grandprix', 'putsinglerace', {race: race})
                            .then(function (resp) {
                                $scope.loadEvent(false);
                            });
                }

                $scope.pos2 = function(laneteam, laneraceno, race) {
                    mapToDatastoreFormat(race);
                    if (laneraceno != null) {
                        // Take the winner team from the raceno
                        race.place2teamkey = GlobalService.getRacesMap()[laneraceno].place1team.key;
                    } else {
                        removePlaceForTeam(race, laneteam.key);
                        race.place2teamkey = laneteam.key;
                    }
                    checkForFinish(race)
                    GApi.execute('grandprix', 'putsinglerace', {race: race})
                            .then(function (resp) {
                                $scope.loadEvent(false);
                            });
                }

                $scope.pos3 = function(laneteam, laneraceno, race) {
                    mapToDatastoreFormat(race);
                    if (laneraceno != null) {
                        // Take the winner team from the raceno
                        race.place3teamkey = GlobalService.getRacesMap()[laneraceno].place1team.key;
                    } else {
                        removePlaceForTeam(race, laneteam.key);
                        race.place3teamkey = laneteam.key;
                    }
                    checkForFinish(race)
                    GApi.execute('grandprix', 'putsinglerace', {race: race})
                            .then(function (resp) {
                                $scope.loadEvent(false);
                            });
                }

                // Start blinker
                function blinker() {
                    $scope.blinkerVisible = !$scope.blinkerVisible;
                    $timeout(blinker, 700);
                }
                $timeout(blinker, 700);

                $scope.raceActive = function (race) {
                    if (race.actualstarttime == null) {
                        return false;
                    } else {
                        if (race.actualendtime != null) {
                            return false;
                        } else {
                            return true;
                        }
                    };
                }

                $scope.editrace = function (race) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'partials/race.html',
                        controller: 'RaceCtrl',
                        resolve: {
                            race: function () {
                                return race;
                            },
                            event: function () {
                                return $scope.event;
                            }
                        }
                    });

                    modalInstance.result.then(function (callbackdata) {
                        console.log('Race returned %o and action %s', callbackdata.race, callbackdata.action);
                        $scope.loading = true;
                        if (callbackdata.action === 'update') {
                            GApi.execute('grandprix', 'putsinglerace', {race: callbackdata.race})
                                    .then(function (resp) {
                                        console.log('Resp on put race: %o', resp.race)
                                        $scope.loadEvent();

                                    })
                        } else if (callbackdata.action === 'delete') {
                            GApi.execute('grandprix', 'deleterace', {no: callbackdata.race.no, eventkey: callbackdata.team.eventkey})
                                    .then(function (resp) {
                                        GlobalService.fetchTeamsAndRaces(true).then(function (resp) {
                                            console.log('Resp on delete race: %o', resp)
                                            $scope.loadEvent();
                                        })
                                    })
                        }
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };

            }]).
        controller('AdminCtrl', ['$scope', 'GlobalService', '$location',
            function ($scope, GlobalService, $location) {
                $scope.isActive = function (path) {
                    return ($location.path().substr(0, path.length) == path);
                }

                GlobalService.fetchTeamsAndRaces(false);

            }]).
        controller('TeamsCtrl', ['$scope', 'GApi', '$uibModal', 'GlobalService',
            function ($scope, GApi, $uibModal, GlobalService) {

                var fetchTeamsAndRaces = function (force) {
                    $scope.loading = true;
                    $scope.nodata = false;
                    GlobalService.fetchTeamsAndRaces(force).then(function () {
                        $scope.races = GlobalService.getRaces();
                        $scope.teams = GlobalService.getTeams();
                        $scope.event = GlobalService.getEvent();
                        if ($scope.teams.length === 0) {
                            $scope.nodata = true;
                        } else {
                            $scope.nodata = false;
                        }
                        $scope.loading = false;
                    });
                }

                fetchTeamsAndRaces(false);

                $scope.editteam = function (team, ek) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'partials/team.html',
                        controller: 'TeamCtrl',
                        resolve: {
                            team: function () {
                                return team;
                            },
                            eventkey: function () {
                                return ek;
                            }
                        }
                    });

                    modalInstance.result.then(function (callbackdata) {
                        console.log('Team returned %o and action %s', callbackdata.team, callbackdata.action);
                        $scope.loading = true;
                        if (callbackdata.action === 'update') {
                            GApi.execute('grandprix', 'putsingleteam', {team: callbackdata.team})
                                    .then(function (resp) {
                                        console.log('Resp on put team: %o', resp.team)
                                        $scope.teams.push(resp.team);
                                        GlobalService.setTeams($scope.teams);
                                        $scope.loading = false;
                                    })
                        } else if (callbackdata.action === 'delete') {
                            GApi.execute('grandprix', 'deleteteam', {teamkey: callbackdata.team.teamkey, eventkey: callbackdata.team.eventkey})
                                    .then(function (resp) {
                                        GlobalService.fetchTeamsAndRaces(true).then(function (resp) {
                                            console.log('Resp on delete team: %o', resp)
                                            $scope.teams = GlobalService.getTeams();
                                            $scope.loading = false;
                                        })
                                    })
                        }
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
            }]).
        controller('TeamCtrl', ['$scope', '$uibModalInstance', 'team', 'eventkey',
            function ($scope, $uibModalInstance, team, eventkey) {
                $scope.mode = (team == null ? 'new' : 'edit');
                $scope.ok = function () {
                    $uibModalInstance.close({action: 'update', team: $scope.team});
                };
                $scope.delete = function () {
                    $uibModalInstance.close({action: 'delete', team: $scope.team});
                }

                if (team == null) {
                    $scope.team = {eventkey: eventkey, name: null};
                } else {
                    $scope.team = team;
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]).
        controller('RaceCtrl', ['$scope', '$uibModalInstance', 'GlobalService', 'race', 'event',
            function ($scope, $uibModalInstance, GlobalService, race, event) {
                $scope.mode = (race == null ? 'new' : 'edit');
                $scope.ok = function () {
                    console.log("The race is %o ", $scope.race)
                    $uibModalInstance.close({action: 'update', race: $scope.race});
                };
                $scope.delete = function () {
                    $uibModalInstance.close({action: 'delete', race: $scope.race});
                }

                if (race == null) {
                    console.log("No race. Making a new race object..");
                    $scope.race = {eventkey: event.key, no: null, scheduledstarttime: event.eventdate};
                    console.log("The new race is: %o", $scope.race)
                } else {
                    $scope.race = race;
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.getTeams = function () {
                    return GlobalService.getTeams();
                };

                $scope.getRaces = function () {
                    return GlobalService.getRaces();
                }
            }])
        ;