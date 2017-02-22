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
.controller('ReportCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$timeout',
 function($scope, $firebaseArray, $firebaseObject, $timeout) {
	var users = $firebaseArray(rootRef.child('Users'));
	var categories = $firebaseArray(rootRef.child('category'));
	var categoryList = $firebaseObject(rootRef.child('categoryList'));
	var ratings = $firebaseArray(rootRef.child('Rating'));
	$scope.pageStatus = 'loading';

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
		if( counter===3 ) {
			$scope.selectedCat = $scope.categories[0];
			$scope.skills = Object.values($scope.categoryList[ $scope.selectedCat ]);
			$scope.skills.unshift('All');	
			$scope.selectedOptionSkill = $scope.skills[0];
			updateResult();
			$scope.pageStatus = 'loaded';
		}
	};

	$scope.optionsChanged = function(state) {
		switch(state) {
			case 'category': 
				$scope.skills = $scope.categoryList[ $scope.selectedCat ];
				$scope.skills = Object.values($scope.categoryList[ $scope.selectedCat ]);
				$scope.skills.unshift('All');
				$scope.selectedOptionSkill = $scope.skills[0];
				break;
			case 'skill': 
				break;
			case 'rating': 
				break;
		}
		updateResult();
	};

	var updateResult = function() {
		var labels = $scope.ratings.slice(1);
		var skills = $scope.skills.slice(1);
		var options = {
			xAxis: {
				categories: labels
			},
			yAxis: {
				title: {
					text: 'Count'
				}
			},
			plotOptions : {
				line: {
					dataLabels: {
						enabled: true
					}
				}
			}
		};
		var series = {};
		if( $scope.selectedRate === 'All' && $scope.selectedOptionSkill === 'All' ) {
			for(var skillName in skills) {
				series[skills[skillName]] = {
					name: skills[skillName],
					data: [0,0,0,0,0]
				}
			}
			$scope.users.forEach((user)=>{
				var selectedSkills = user.tech[$scope.selectedCat];
				for(var key in selectedSkills) {
					series[key].data[selectedSkills[key]]++;
				}
			});
			options.series = Object.values(series);
		}

		if( $scope.selectedRate === 'All' && $scope.selectedOptionSkill !== 'All' ) {
			var data = [0,0,0,0,0];
			$scope.users.forEach((user)=>{
				var selectedSkills = user.tech[$scope.selectedCat];
				for(var key in selectedSkills) {
					if(key === $scope.selectedOptionSkill ) {
						data[selectedSkills[key]]++;
					}
					
				}
			});
			options.series = [
				{
					name: $scope.selectedOptionSkill,
					data: data
				}
			];
		}
		$scope.options = null;	
		$timeout(() => {
			$scope.options = options;
		}, 10);
		
	};

	ratings.$loaded().then(function(){
		$scope.ratings = ratings.map((item) => {
			return item.$value;
		});
		$scope.ratings.unshift('All');
		$scope.selectedRate = $scope.ratings[0];
		updateSkillsList();
	});

	
}])
.directive('skillsHighcharts', function(){
	return {
		restrict: 'A',
		scope: {
			options: '=',
		},
		link: function(scope, element) {
			Highcharts.chart('container', scope.options);
		}
	}
});
/*
.directive('materialSelect', function() {
	return {
		link: function(scope, element) {
			$(element[0]).dropdown();
		}
	}
})*/