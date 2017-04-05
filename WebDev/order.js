'use script';

angular.module('VoteApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']) //ngSanitize for HTML displaying

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
			url: '/', 
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})	
		$urlRouterProvider.otherwise('/'); //other route

})

//home page settings
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {


}]);
