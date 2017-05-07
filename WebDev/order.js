'use script';

angular.module('VoteApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']) //ngSanitize for HTML displaying

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
			url: '/index', 
			templateUrl: '/index.html',
			controller: 'HomeCtrl'
		})
	.state('bills', {
		url: 'bills',
		templateUrl: 'partials/bills.html',
		controller: 'ArtCtrl'
	})
	.state('polilitician', {
		url: '/politicians',
		templateUrl: 'partials/politicians.html',
		controller: 'PolCtrl'
	})
	$urlRouterProvider.otherwise('/'); //other route
})

//home page settings
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('ArtCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('PolCtrl', ['$scope', '$http', function($scope, $http) {


}]);