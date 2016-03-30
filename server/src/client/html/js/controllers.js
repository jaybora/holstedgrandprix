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
                $scope.isActive = function(path) {
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
                    return GlobalService.fetchEvent().then(function() {
                        console.log("The controller got the event done");
                        $scope.event = GlobalService.getEvent();
                        $scope.loading = false;
                    }, function(reason) {
                        console.log("Could not load program for event. Reason: " + reason);
                        $scope.loading = false;
                    });

                };
                
                $scope.loadEvent();

            }]).
        controller('AdminIndexCtrl', ['$scope', 'GlobalService',
            function ($scope, GlobalService) {
                
            }])
        
;