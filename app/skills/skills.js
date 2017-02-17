'use strict';

angular.module('mySkills.skills', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/skills', {
    templateUrl: 'skills/skills.html',
    controller: 'SkillsCtrl'
  });
}])

//skills controller
.controller('SkillsCtrl', ['$scope','$firebaseArray', 'UserService', '$location',
 function($scope,$firebaseArray, UserService, $location) {
	//init firebase
	//get skills
	$scope.result = {};
	$scope.users = $firebaseArray(rootRef.child('Users'));
	$scope.categories = $firebaseArray(rootRef.child('category'));

	if(!UserService.user || UserService.userDomain !== 'imaginea') {
		$location.path('auth');
		return;
	}

	//show add form
	$scope.showAddForm = function(){
		$scope.addFormShow = true;
	};

	//hide form
	$scope.hide = function(){
		$scope.addFormShow = false;
		//$scope.contactShow = false;
	};
	$scope.users.$loaded().then(function(){
		var key = appUtils.getEmailKey(UserService.user.email);
		var data = $scope.users.$getRecord(key) || {};
		$scope.result = data && data.tech && data.tech[$scope.selectedCategory] || {};
	});
	
	$scope.updateSkills = function(result){
		console.log("updating skills...");
		console.log($scope.selectedCategory);
		console.log($scope.result);
		//get id
		var tempObj = {};
		tempObj[$scope.selectedCategory] = $scope.result;
		var obj = {
			id: UserService.user.email,
			displayName:UserService.user.displayName,
			tech: tempObj
		};
		var key = appUtils.getEmailKey(obj.id);
		rootRef.child('Users/' + key).set(obj)
		.then(function(ref){
			//$scope.id = ref.key;
			//console.log($scope.id);
			//clear form
			alert("your message is sent successfully");
			//$scope.clearFields();
			//hide form
			$scope.addFormShow = false;
		});

	};

	$scope.selectedSkills = function(){
		console.log($scope.selectedCategory);
		$scope.skills = $firebaseArray(rootRef.child('categoryList').child($scope.selectedCategory));
		$scope.ratings = $firebaseArray(rootRef.child('Rating'));
		console.log($scope.ratings);


		var key = appUtils.getEmailKey(UserService.user.email);
		var data = $scope.users.$getRecord(key) || {};
		$scope.result = data && data.tech && data.tech[$scope.selectedCategory] || {};
	}


}]);