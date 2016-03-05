angular.module('grandprix', ['ngRoute', 'ngAnimate', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {    
        $routeProvider.when('/frontpage', {templateUrl: 'partials/frontpage.html', controller: 'FrontpageCtrl'});
        $routeProvider.when('/program', {templateUrl: 'partials/program.html'});
        $routeProvider.when('/news', {templateUrl: 'partials/news.html'});
        $routeProvider.when('/rules', {templateUrl: 'partials/rules.html'});
        $routeProvider.when('/2015', {templateUrl: 'partials/2015.html'});
        $routeProvider.otherwise({redirectTo: 'frontpage'});
    }])
    // .config(function($gapiProvider){
    //     $gapiProvider.client_id = '120288103368-9ba8linfgfgf4uubeucaq9cvvroc851s.apps.googleusercontent.com';
    //     $gapiProvider.api_base = '/_ah/api';
    // })
    .filter('yesNo', function() {
        return function(input) {
            return input ? 'Ja' : 'Nej';
        }
    })


function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
