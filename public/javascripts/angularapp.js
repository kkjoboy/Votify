'use script';

angular.module('VoteApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']) //ngSanitize for HTML displaying

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
	.state('home', {
		url: '/', 
		templateUrl: '/partials/home.html',
		controller: 'HomeCtrl'
	})	
	.state('newsfeed', {
		url: '/newsfeed',
		templateUrl: '/partials/newsfeed.html',
		controller: 'NewsCtrl'
	})
	.state('articles', {
		url: '/articles',
		templateUrl: '/partials/articles.html',
		controller: 'ArtCtrl'
	})
	.state('profile', {
		url: '/profile',
		templateUrl: '/partials/profile.html',
		controller: 'ProfileCtrl'
	})
	.state('politician', {
		url: '/politicians',
		templateUrl: '/partials/politicians.html',
		controller: 'PolCtrl'
	})
	.state('bills', {
		url: '/bills',
		templateUrl: '/partials/bills.html',
		controller: 'BillCtrl'
	})
	$urlRouterProvider.otherwise('/'); //other route
	$locationProvider.html5Mode(true);
})

//home page settings
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.name = "JOSH"
	console.log("HEY " + $scope.name);

}])

.controller('NewsCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.count = 0;
	$scope.count1 = 0;

	$scope.UpVote = function() {
		$scope.count++;
	}
	$scope.DownVote = function() {
		$scope.count1++;
	}

}])
.controller('ArtCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('ProfileCtrl', ['$scope', '$http', function($scope, $http) {


}])
.controller('PolCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get('/api/politicians').
		success(function(data, status, headers, config) {
			console.log('success');
			$scope.politicians = data;
			console.log(data);
		}).
		catch(function(data, status, headers, config) {
		console.log('catch');
		console.log(status);
		console.log(data);
	});

}])
.controller('BillCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get('/api/bills').
		success(function(data, status, headers, config) {
			console.log('success');
			$scope.bills = data;
			console.log(data);
		}).
		catch(function(data, status, headers, config) {
		console.log('catch');
		console.log(status);
		console.log(data);
	});

}]);