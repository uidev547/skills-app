'use strict';

// Declare app level module which depends on views, and components
angular.module('mySkills', [
  'ngRoute',
  'mySkills.skills',
  'firebase'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/skills'});
}]);
