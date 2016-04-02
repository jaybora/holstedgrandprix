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
        controller('ProgramCtrl', ['$scope', 'GlobalService', '$timeout',
            function ($scope, GlobalService, $timeout) {
                $scope.loading = true;
                $scope.loadEvent = function () {
                    $timeout($scope.loadEvent, 30000);
                    return GlobalService.fetchEvent().then(function () {
                        console.log("The controller got the event done");
                        $scope.event = GlobalService.getEvent();
                        $scope.loading = false;
                    }, function (reason) {
                        console.log("Could not load program for event. Reason: " + reason);
                        $scope.loading = false;
                    });

                };

                $scope.loadEvent();

            }]).
        controller('AdminCtrl', ['$scope', 'GlobalService', '$location',
            function ($scope, GlobalService, $location) {
                $scope.isActive = function (path) {
                    return ($location.path().substr(0, path.length) == path);
                }

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
                            eventkey: function() {
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
            }])
        ;