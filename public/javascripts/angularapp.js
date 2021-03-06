'use script';

var globalId; 

angular.module('VoteApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'angularUtils.directives.dirPagination']) //ngSanitize for HTML displaying

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $sceDelegateProvider) {
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
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from our assets domain. **.
		'http://app.leg.wa.gov/**'
	]);
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

	$scope.deleteScript = function(url, id) {
		
		// var heads = document.getElementsByTagName("head");
		// var script = heads.removeChild(document.querySelector("script[src*='"+url+"']"));
		var script = document.querySelector("script[src*='"+url+"']")
		if (script == null) {
			return;
		} else {
			console.log("Right here bitch");
			// console.log(script.parentNode);
			var scriptElem = document.getElementById(id);
			console.log(scriptElem)
			scriptElem.parentNode.removeChild(scriptElem);
		}
	};

	$scope.loadScript = function(url, type, charset, id) {
		if (type===undefined) type = 'text/javascript';
		if (url) {
			var script = document.querySelector("script[src*='"+url+"']");
			if (!script) {
				var heads = document.getElementsByTagName("head");
				if (heads && heads.length) {
					var head = heads[0];
					if (head) {
						script = document.createElement('script');
						script.setAttribute('src', url);
						script.setAttribute('type', type);
						script.setAttribute('id', id)
						if (charset) script.setAttribute('charset', charset);
						head.appendChild(script);
					}
				}
			}
			return script;
		}
	};

	$scope.deleteScript('javascripts/d3.js', 'fuckthisshityouknowigotit');
	$scope.deleteScript('javascripts/d32.js', 'fuckthisshityouknowigotit2');

	$scope.loadScript('javascripts/d3.js', 'text/javascript', 'utf-8', 'fuckthisshityouknowigotit');
	$scope.loadScript('javascripts/d32.js', 'text/javascript', 'utf-8', 'fuckthisshityouknowigotit2');

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
			console.log(data);
		}).
		catch(function(data, status, headers, config) {
		console.log('catch');
		console.log(status);
		console.log(data);
	});

	//Contains the filter options
	$scope.filterOptions = {
		stores: [
		{id : 2, name : 'Show All', Party: 'All' },
		{id : 3, name : 'Democrat', Committee: 'D' },
		{id : 4, name : 'Republican', Committee: 'R' },
		]
	};
	
	// Contains the sorting options
	$scope.sortOptions = {
		stores: [
		{id : 1, name : 'District: Ascending' },      
		{id : 2, name : 'District: Descending' },
		]
	};
	
	//Mapped to the model to filter
	$scope.filterItem = {
		store: $scope.filterOptions.stores[0]
	}
	
	//Mapped to the model to sort
	$scope.sortItem = {
		store: $scope.sortOptions.stores[0]
	};
	
	//Watch the sorting model - when it changes, change the
	// ordering of the sort (descending / ascending)
	$scope.$watch('sortItem', function () {
		console.log($scope.sortItem);
		if ($scope.sortItem.store.id === 1) {
			$scope.reverse = true;
		} else {
			$scope.reverse = false;
		}
	}, true);
	
	//Custom filter - filter based on the rating selected
	$scope.customFilter = function (data) {
		if (data.Party === $scope.filterItem.store.Party) {
			return true;
		} else if ($scope.filterItem.store.Party === 'All') {
			return true;
		} else {
			return false;
		}
	};

}])
.controller('BillCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get('/api/bills').
		success(function(data, status, headers, config) {
			$scope.bills = data;
			console.log(data);
		}).
		catch(function(data, status, headers, config) {
		console.log('catch');
		console.log(status);
		console.log(data);
	});

	//Contains the filter options
	$scope.filterOptions = {
		stores: [
		{id : 2, name : 'Show All', Committee: 'All' },
		{id : 3, name : 'Agriculture & Natural Resources', Committee: 'Agriculture & Natural Resources' },
		{id : 4, name : 'Agriculture, Water, Trade & Economic Development', Committee: 'Agriculture, Water, Trade & Economic Development' },
		{id : 5, name : 'Appropriations', Committee: 'Appropriations' },
		{id : 6, name : 'Business & Financial Services', Committee: 'Business & Financial Services' },
		{id : 7, name : 'Capital Budget', Committee: 'Capital Budget' },
		{id : 8, name : 'Commerce & Gaming', Committee: 'Commerce & Gaming' },
		{id : 9, name : 'Commerce, Labor & Sports', Committee: 'Commerce, Labor & Sports' },
		{id : 10, name : 'Community Development, Housing & Tribal Affairs', Committee: 'Community Development, Housing & Tribal Affairs' },
		{id : 11, name : 'Early Learning & Human Services', Committee: 'Early Learning & Human Services' },
		{id : 12, name : 'Early Learning & K-12 Education', Committee: 'Early Learning & K-12 Education' },
		{id : 13, name : 'Education', Committee: 'Education' },
		{id : 14, name : 'Energy, Environment & Telecommunications', Committee: 'Energy, Environment & Telecommunications' },
		{id : 15, name : 'Environment', Committee: 'Environment' },
		{id : 16, name : 'Finance', Committee: 'Finance' },
		{id : 17, name : 'Financial Institutions & Insurance', Committee: 'Financial Institutions & Insurance' },
		{id : 18, name : 'Health Care', Committee: 'Health Care' },
		{id : 19, name : 'Health Care & Wellness', Committee: 'Health Care & Wellness' },
		{id : 20, name : 'Higher Education', Committee: 'Higher Education' },
		{id : 21, name : 'Human Services, Mental Health & Housing', Committee: 'Human Services, Mental Health & Housing' },
		{id : 22, name : 'Judiciary', Committee: 'Judiciary' },
		{id : 23, name : 'Labor & Workplace Standards', Committee: 'Labor & Workplace Standards' },
		{id : 24, name : 'Law & Justice', Committee: 'Law & Justice' },
		{id : 25, name : 'Local Government', Committee: 'Local Government' },
		{id : 26, name : 'Natural Resources & Parks', Committee: 'Natural Resources & Parks' },
		{id : 27, name : 'Public Safety', Committee: 'Public Safety' },
		{id : 28, name : 'State Government', Committee: 'State Government' },
		{id : 29, name : 'State Government, Elections & Information Technology', Committee: 'State Government, Elections & Information Technology' },
		{id : 30, name : 'Technology & Economic Development', Committee: 'Technology & Economic Development' },
		{id : 31, name : 'Transportation', Committee: 'Transportation' },
		{id : 32, name : 'Ways & Means', Committee: 'Ways & Means' }
		]
	};
	
	// Contains the sorting options
	$scope.sortOptions = {
		stores: [
		{id : 1, name : 'Date: Most Recent' },      
		{id : 2, name : 'Date: Ordered' },
		]
	};
	
	//Mapped to the model to filter
	$scope.filterItem = {
		store: $scope.filterOptions.stores[0]
	}
	
	//Mapped to the model to sort
	$scope.sortItem = {
		store: $scope.sortOptions.stores[0]
	};
	
	//Watch the sorting model - when it changes, change the
	// ordering of the sort (descending / ascending)
	$scope.$watch('sortItem', function () {
		console.log($scope.sortItem);
		if ($scope.sortItem.store.id === 1) {
			$scope.reverse = true;
		} else {
			$scope.reverse = false;
		}
	}, true);
	
	//Custom filter - filter based on the rating selected
	$scope.customFilter = function (data) {
		if (data.Name === $scope.filterItem.store.Committee) {
			return true;
		} else if ($scope.filterItem.store.Committee === 'All') {
			return true;
		} else {
			return false;
		}
	};

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