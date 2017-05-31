'use script';

var globalId; 

angular.module('VoteApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'angularUtils.directives.dirPagination']) //ngSanitize for HTML displaying

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
	.state('pol_profile', {
		url: '/politicians/:idSponsor',
		templateUrl: '/partials/pol_profile.html',
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
	.state('single-bill', {
		url: '/bills/:BillID',
		templateUrl: '/partials/singleBill.html',
		controller: 'SingleBillCtrl'
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
.controller('ProfileCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

	var idSponsor = $stateParams.idSponsor;
	$scope.idSponsor = idSponsor;
	globalId = idSponsor;
	var data = 	{
					idSponsor : $scope.idSponsor
                };
	$http.post('/api/politicians/'+$scope.idSponsor, data)
		.success(function(data, status, headers, config) {
			console.log('Success')
			$scope.profileData = data;
			console.log(data);
		})
		.catch(function(data, status, headers, config) {
			console.log('catch');
			console.log(status);
			console.log(data);
		});

}])
.controller('PolCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get('/api/politicians').
		success(function(data, status, headers, config) {
			$scope.politicians = data;
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
			$scope.bills = data;

		}).
		catch(function(data, status, headers, config) {
		console.log('catch');
		console.log(status);
		console.log(data);
	});

}])
.controller('SingleBillCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

	var BillID = $stateParams.BillID;
	$scope.BillID = BillID;
	var data = 	{
					BillID : $scope.BillID
                };
	
	console.log(data);

	$http.post('/api/bills/'+$scope.BillID, data)
		.success(function(data, status, headers, config) {
			console.log('Success');
			$scope.bill = data;
			console.log(data);

		})
		.catch(function(data, status, headers, config) {
			console.log('catch');
			console.log(status);
			console.log(data);
		});
}]);