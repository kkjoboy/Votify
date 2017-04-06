'use script';

angular.module('VoteApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']) //ngSanitize for HTML displaying

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
			url: '/home', 
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})	
	.state('newsfeed', {
		url: '/newsfeed',
		templateUrl: 'partials/newsfeed.html',
		controller: 'NewsCtrl'
	})
	.state('article', {
		url: '/articles',
		templateUrl: 'partials/articles.html',
		controller: 'ArtCtrl'
	})
	$urlRouterProvider.otherwise('/'); //other route
})

//home page settings
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {


}])

.controller('NewsCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('ArtCtrl', ['$scope', '$http', function($scope, $http) {


}]);
