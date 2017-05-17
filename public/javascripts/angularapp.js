'use script';

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
			console.log('Success');
			$scope.bills = data;
			console.log(data);
			$scope.filteredBills = []
			,$scope.currentPage = 1
			,$scope.numPerPage = 24
			,$scope.maxSize = 10;

			$scope.$watch("currentPage + numPerPage", function() {
				var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage;

				$scope.filteredBills = $scope.bills.slice(begin, end);
			});

			// var vm = this;

			// vm.dummyItems = $scope.bills; // dummy array of items to be paged
			// vm.pager = {};
			// vm.setPage = setPage;

			// initController();

			// function initController() {
			// 	// initialize to page 1
			// 	vm.setPage(1);
			// }

			// function setPage(page) {
			// 	if (page < 1 || page > vm.pager.totalPages) {
			// 		return;
			// 	}

			// 	// get pager object from service
			// 	vm.pager = PagerService.GetPager(vm.dummyItems.length, page);

			// 	// get current page of items
			// 	vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
			// }

		}).
		catch(function(data, status, headers, config) {
		console.log('catch');
		console.log(status);
		console.log(data);
	});

}]);
// .factory('PagerService', PagerService);


// function PagerService() {
// 	// service definition
// 	var service = {};

// 	service.GetPager = GetPager;

// 	return service;

// 	// service implementation
// 	function GetPager(totalItems, currentPage, pageSize) {
// 		// default to first page
// 		currentPage = currentPage || 1;

// 		// default page size is 10
// 		pageSize = pageSize || 10;

// 		// calculate total pages
// 		var totalPages = Math.ceil(totalItems / pageSize);

// 		var startPage, endPage;
// 		if (totalPages <= 10) {
// 			// less than 10 total pages so show all
// 			startPage = 1;
// 			endPage = totalPages;
// 		} else {
// 			// more than 10 total pages so calculate start and end pages
// 			if (currentPage <= 6) {
// 				startPage = 1;
// 				endPage = 10;
// 			} else if (currentPage + 4 >= totalPages) {
// 				startPage = totalPages - 9;
// 				endPage = totalPages;
// 			} else {
// 				startPage = currentPage - 5;
// 				endPage = currentPage + 4;
// 			}
// 		}

// 		// calculate start and end item indexes
// 		var startIndex = (currentPage - 1) * pageSize;
// 		var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

// 		// create an array of pages to ng-repeat in the pager control
// 		var pages = _.range(startPage, endPage + 1);

// 		// return object with all pager properties required by the view
// 		return {
// 			totalItems: totalItems,
// 			currentPage: currentPage,
// 			pageSize: pageSize,
// 			totalPages: totalPages,
// 			startPage: startPage,
// 			endPage: endPage,
// 			startIndex: startIndex,
// 			endIndex: endIndex,
// 			pages: pages
// 		};
// 	}
// }