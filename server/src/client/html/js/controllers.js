'use strict';

function init() {
  console.log("Init");
  //window.init();
  var scope = angular.element(document.getElementById("thebody")).scope();
  scope.$apply(function() {
  	scope.load_microfinance_lib();
  })
}

angular.module('grandprix').
	controller('LandingCtrl', ['$scope',
		function($scope) {

		}]).
	controller('FrontpageCtrl', ['$scope',
		function($scope) {
			$scope.slides = [{image: 'images/1.jpg', text: 'Det tradionsrige sæbekasseløb ved Holsted Skole', id: 0},
			{image: 'images/2.jpg', text: 'Er tilbage igen den 27. maj 2016', id: 1}]

		}])