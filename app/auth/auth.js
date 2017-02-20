'use strict';

angular.module('mySkills.auth', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/auth', {
    templateUrl: 'auth/auth.html',
    controller: 'AuthCtrl'
  });
}])

//skills controller
.controller('AuthCtrl', ['$scope', 'UserService', function($scope, UserService) {
	$scope.userService = UserService;
}])
.factory('UserService',['$firebaseAuth', '$location', function($firebaseAuth, $location) {
	var data = {
		status: 'loading',
		user: null,
		userDomain: ''
	};
	var auth = $firebaseAuth();
	auth.$onAuthStateChanged(function(user) {
        if (user) {
		  data.status = 'loggedin';
		  data.user = user;
		  if( data.user.email.indexOf('@imaginea.com') !== -1 ) {
			  data.userDomain = 'imaginea';
			  //$location.path( "/skills" );
		  }
		  

        } else {
            data.status = 'loggedout';
		  	data.user = null;
			$location.path( "/auth" );
        }
    });

	data.login = function(event) {
		event.preventDefault();
		
		//var provider = new firebase.auth.GoogleAuthProvider();
		auth.$signInWithPopup("google").then(function(result) {
			console.log('loggedIn', result);
		}).catch(function(error) {
			console.log('error', error);
		});
	}

	data.logout = function(event) {
		event.preventDefault();
		auth.$signOut().then(function() {
			// Sign-out successful.
		}, function(error) {
			// An error happened.
		});
	}

	return data;
}])
.directive('appHeader', function() {
	return {
		restrict: 'A',
		controller:  ['$scope', 'UserService', function($scope, UserService) {
			$scope.userService = UserService;
		}]
	}
});
