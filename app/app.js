'use strict';

// Declare app level module which depends on views, and components
angular.module('mySkills', [
  'ngRoute',
  'mySkills.skills',
  'mySkills.auth',
  'firebase'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/skills'});
}]);


var appUtils = {
  getEmailKey: function(key) {
    return key.replace(/[^\w\s]/gi, '_');
  }
}
