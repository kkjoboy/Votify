'use script';

angular.module('VoteApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']) //ngSanitize for HTML displaying

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
		url: '/', 
		templateUrl: 'partials/home.html',
		controller: 'HomeCtrl'
	})
	.state('about', {
		url: '/about',
		templateUrl: 'partials/home.html',
		controller: 'AboutCtrl'
	})
	.state('bills', {
		url: '/bills',
		templateUrl: 'partials/bills.html',
		controller: 'BillCtrl'
	})
	.state('politician', {
		url: '/politicians',
		templateUrl: 'partials/politicians.html',
		controller: 'PolCtrl'
	})
	.state('profile', {
		url: '/profile',
		templateUrl: 'partials/pol.html',
		controller: 'PolCtrl'
	})
	$urlRouterProvider.otherwise('/'); //other route
})

//home page settings
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('AboutCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('BillCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('PolCtrl', ['$scope', '$http', function($scope, $http) {


}]);