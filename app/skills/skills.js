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
	//init variable
	$scope.showBtn = false;
	$scope.userSkills = null;
	$scope.feedData = false;
	$scope.showMsg = false;
	$scope.msg = null;
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
		$scope.showMsg = false;
		$scope.newSkill = null;
	};

	//load user data 
	$scope.users.$loaded().then(function(){
		var key = appUtils.getEmailKey(UserService.user.email);
		var data = $scope.users.$getRecord(key) || {};
		$scope.result = data && data.tech && data.tech[$scope.selectedCategory] || {};
		if(data.tech){
			$scope.showBtn = true;
		}
		
	});
	
	$scope.updateSkills = function(result){
		console.log("updating skills...");
		//get id
		var tempObj = {};
		tempObj[$scope.selectedCategory] = $scope.result;
		var obj = {
			id: UserService.user.email,
			displayName:UserService.user.displayName,
			tech: tempObj
		};
		var key = appUtils.getEmailKey(obj.id);
		var data = $scope.users.$getRecord(key) || {};
		if(angular.equals(data, {})){
			rootRef.child('Users/' + key).set(obj).then(function(ref){
				//hide form
				$scope.addFormShow = false;
			});
		}
		else{
			rootRef.child('Users/'+ key + '/tech/' + $scope.selectedCategory).set($scope.result).then(function(ref){
				//hide form
				$scope.addFormShow = false;
			});
		}
		$scope.msg = "your data updated successfully";
		$scope.showMsg = true;
	};

	$scope.selectedSkills = function(){
		$scope.showMsg = false;
		$scope.msg = null;
		$scope.addFormShow = false;
		$scope.skills = $firebaseArray(rootRef.child('categoryList').child($scope.selectedCategory));
		$scope.ratings = $firebaseArray(rootRef.child('Rating'));
		var key = appUtils.getEmailKey(UserService.user.email);
		var data = $scope.users.$getRecord(key) || {};
		$scope.result = data && data.tech && data.tech[$scope.selectedCategory] || {};
	}

	$scope.addNewSkill = function(){
		if($scope.newSkill){
			rootRef.child('categoryList/'+ $scope.selectedCategory + '/').push($scope.newSkill)
			.then(function(ref){ });	
		}
		$scope.newSkill = null;
	}

	$scope.showReport = function(){
		$scope.showMsg = false;
		$scope.feedData = true;
		var key = appUtils.getEmailKey(UserService.user.email);
		var data = $scope.users.$getRecord(key) || {};
		$scope.userSkills = data.tech;
		$scope.ratings = $firebaseArray(rootRef.child('Rating'));
	}

}]);