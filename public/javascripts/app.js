var app = angular.module('app', [
	'ngRoute'
	]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/home', {
			templateUrl: 'partials/home.html'
		}).
		when('/basicdata', {
			templateUrl: 'partials/basicdata.html',
			controller: 'basicdataCtrl'
		}).
		when('/salarycalculation', {
			templateUrl: 'partials/salarycalculation.html',
			controller: 'salaryCalculationRootCtrl'
		}).
		otherwise({
			redirectTo: '/home'
		});
	}]);

