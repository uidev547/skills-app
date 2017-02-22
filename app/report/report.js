'use strict';
var counter = 0;
angular.module('mySkills.report', ['ngRoute','firebase'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/report', {
    templateUrl: 'report/report.html',
    controller: 'ReportCtrl'
  });
}])

//skills controller
.controller('ReportCtrl', ['$scope', '$firebaseArray', '$firebaseObject', function($scope, $firebaseArray, $firebaseObject) {
	var users = $firebaseArray(rootRef.child('Users'));
	var categories = $firebaseArray(rootRef.child('category'));
	var categoryList = $firebaseObject(rootRef.child('categoryList'));
	var ratings = $firebaseArray(rootRef.child('Rating'));

	users.$loaded().then(function(){
		$scope.users = users;
	});

	categoryList.$loaded().then(function(){
		$scope.categoryList = categoryList;
		updateSkillsList();
	});


	categories.$loaded().then(function(){
		$scope.categories = categories.map((item) => {
			return item.$value;
		});
		updateSkillsList();
	});

	var updateSkillsList = function() {
		counter++;
		if( counter===2 ) {
			$scope.selectedCat = $scope.categories[0];
			$scope.skills = Object.values($scope.categoryList[ $scope.selectedCat ]);
			$scope.skills.unshift('All');	
			$scope.selectedSkill = $scope.skills[0];
		}
	};

	$scope.optionsChanged = function(state) {
		switch(state) {
			case 'category': 
				$scope.skills = $scope.categoryList[ $scope.selectedCat ];
				$scope.skills = Object.values($scope.categoryList[ $scope.selectedCat ]);
				$scope.skills.unshift('All');
				$scope.selectedSkill = $scope.skills[0];
				break;
			case 'skill': 
				break;
			case 'rating': 
				break;
		}
		updateResult();
	};

	var updateResult = function() {
		if( $scope.selectedRate === 'All' && $scope.selectedSkill === 'All' ) {
			$scope.labels = $scope.ratings.slice(1);
			$scope.series = $scope.skills.slice(1);
			/*$scope.data = [
				[65, 59, 80, 45, 30],
				[28, 48, 40, 19, 40]
			] */
			$scope.data = {};
			for(var i in $scope.series) {
				$scope.data[$scope.series[i]] = [0,0,0,0,0];
			}
			$scope.users.forEach((user)=>{
				var selectedSkills = user.tech[$scope.selectedCat];
				debugger;
				for(var key in selectedSkills) {
					$scope.data[key][selectedSkills[key]]++;
				}
			});
			$scope.data = Object.values($scope.data);
			
		}
	};

	ratings.$loaded().then(function(){
		$scope.ratings = ratings.map((item) => {
			return item.$value;
		});
		$scope.ratings.unshift('All');
		$scope.selectedRate = $scope.ratings[0];
	});

	$scope.options = [{
		scales: {
			yAxes: [{
				ticks: {
					stepSize: 1
				}
			}]
		}
	}];
}])
/*
.directive('materialSelect', function() {
	return {
		link: function(scope, element) {
			$(element[0]).dropdown();
		}
	}
})*/