console.log("in userResultsSearch.js");

var userResultsSearch = angular.module('userResultsSearch',['ngRoute']);

userResultsSearch.controller('userResultsSearch', function($scope, $http, $route) {

	/*$scope.userid = window.useridScript;
	$scope.username = window.usernameScript;
	console.log("scope.userid :: " + $scope.userid);
	console.log("scope.username :: " + $scope.username);
	console.log("window.userid :: " + window.useridScript);
	console.log("window.searchUsername :: " + window.searchUsername);*/
	//console.log(window.json_responses);

	$http({
		method : 'GET',
		url : "/searchUser"
	}).success(function(data) {
		console.log("in searchUser success");
		console.log(data.searchresult);
		console.log(data.statusCode);
		console.log(data);

		if(data.statusCode == 401) {
			console.log("searchUser--statusCode == 401");
		}
		else if(data.statusCode == 200) {
			console.log("searchUser--statusCode == 200");

			//setting the search results' data
			$scope.userid = data.userid;
			$scope.username = data.username;
			$scope.searchresult = data.searchresult;
			$scope.searchUsername = data.searchUsername;
			//setting current user's following list
			$scope.currentuserfollowing = data.currentuserfollowing;
			$scope.isFollowing = new Array();

			if($scope.searchresult!=0){
				var index = 0;
				for(tempsearch in $scope.searchresult){
					//console.log("searchresult.username :: " + $scope.searchresult[tempsearch].username);
					$scope.isFollowing[index] = false;
					for(tempfollwing in $scope.currentuserfollowing){
						//console.log("currentuserfollowing :: " + $scope.currentuserfollowing[tempfollwing]);
						if($scope.searchresult[tempsearch].username == $scope.currentuserfollowing[tempfollwing]){
							$scope.isFollowing[index] = true;
						}
					}
					//console.log("i :: " + index + " - isFollowing :: " + $scope.isFollowing[index]);
					index++;
				}
			}
			/*
			$scope.name = new Array();
			$scope.searchusername = new Array();
			$scope.searchuserid= new Array();
			$scope.isFollowing = new Array();
			//$scope.isUserInSearch = new Array();

			var index=0;
			
			angular.forEach(data.results, function(value, key) {
				console.log(value.firstname);
				console.log(value.lastname);
				console.log(value.username);
				console.log(value.userid);
				
				$scope.name[index] = value.firstname + " " + value.lastname;
				$scope.searchusername[index] = value.username;
				$scope.searchuserid[index] = value.userid;
				$scope.isFollowing[index] = false;

				index++;
			});

			console.log($scope.name);
			console.log($scope.searchusername);
			console.log($scope.searchuserid);
			console.log($scope.isFollowing);
			console.log("userid:: " + $scope.userid);

			getFollowing();*/
		}
	}).error(function(error) {
		console.log("in searchUser error");
		console.log(error);
	});

	console.log("before getFollowing call");

	/*//getFollowing
	var getFollowing = function() {
		$http({
			method : 'POST',
			url : '/getfollowingid'
		}).success(function(data) {
			console.log("in success get followingid");
			console.log(data);
			console.log(data.results);

			

			if(data.statusCode == 401) {
				console.log("getfollowingid--statusCode == 401");
			}
			else if(data.statusCode == 200) {
				console.log("getfollowingid--statusCode == 200");
				
				$scope.followingid = new Array();

				var index = 0;

				angular.forEach(data.results, function(value, key) {
					console.log(value.followingid);

					$scope.followingid[index] = value.followingid;

					index++;
				});


				console.log("searchuserid::" + $scope.searchuserid);
				console.log("searchuserid.length::" + $scope.searchuserid.length);

				for(var i=0;i<$scope.followingid.length;i++){
					for(var j=0;j<$scope.searchuserid.length;j++){
						if($scope.followingid[i] == $scope.searchuserid[j]){
							console.log("i=" + i);
							console.log("j=" + j);
							$scope.isFollowing[j] = true;
						}
					}
				}

				console.log("isFollowing :: " + $scope.isFollowing);
				console.log("followingId :: " + $scope.followingid);
			}

		}).error(function(error){
			console.log("in error get followerid");
			console.log(error);
		});
	}*/

	$scope.viewprofile = function() {
		console.log("in view profile angular controller");
		window.location.assign('/viewprofile');
	};

	$scope.doTweet = function() {
		
		console.log("Tweet is " + $scope.inputTweet);
		if($scope.inputTweet!='')
			$http({
				method : "POST",
				url : "/doTweet",
				data : {
					tweet : $scope.inputTweet
				}
			}).success( function(data) {
				console.log("in success of tweet");
				if(data.statusCode == 401) {
					console.log("in statusCode=401");
					window.alert("ERROR! Tweet is not posted! Please try again");
				}
				else if(data.statusCode == 200) {
					/*window.location.assign('/homepage');*/
					//window.loaction.reload();
					//$route.reload();
					var loc = window.location.toString();
					console.log(loc);
					var locationString = loc.split("localhost:3000");
				    console.log(locationString[1]);
				    window.location.assign(locationString[1]);
				}
			}).error(function(error) {
				console.log("in error of tweet");
				window.alert("ERROR! Tweet can not be posted! Please try again");
			})
	};

	$scope.search = function() {
		console.log("in search Function");

		var searchStr = $scope.inputSearch.toString();

		console.log("searchString :: " + searchStr);

		if(searchStr.length>0) {
			if(searchStr.charAt(0)!= '#'){ //Search String is a user Search
				console.log("in user search");
				console.log("searchString:" + searchStr);
				
				$http({
				method : "GET",
				url : "/userSearchResults",
				params : {
					searchUsername : searchStr
					}
				}).success( function(data) {
					console.log("in success of search");
					console.log(data);
					if(data.statusCode == 401) {
						console.log("in statusCode=401");
						window.alert("ERROR!");
					}
					else if(data.statusCode == 200) {
						console.log("in statusCode=200");
						window.location.assign("/usrSearchResults");	
					}
				}).error(function(error) {
					console.log("in error of search");
					console.log(error);
				});

				//window.location.assign("/userSearchResults/?searchUsername=" + searchStr);
			}
			else {//Search String is HashTag Search
				if(searchStr.length>1){
					console.log("in hashtag search");

					var searchHash = searchStr.split("#")[1];

					$http({
						method : 'GET',
						url : '/searchHashTag',
						params : {
							hashtag : searchHash
						}
					}).success(function(data) {
						
						console.log(data);
						if(data.statusCode == 401) {
							console.log("in statusCode=401");
							window.alert("ERROR!");
						}
						else if(data.statusCode == 200) {
							console.log("in statusCode=200");
							window.location.assign("/srcHashTag");
						}
					}).error(function(error) {
						console.log("in error hashtag search");
						console.log(error);
					});
				}
			}
		}
	};

	$scope.follow = function(clickedFollowingUsername, isFollowing) {
		console.log("in follow function");
		
		console.log("clickedFollowingUsername :: " + clickedFollowingUsername);
		console.log("isFollowing :: " + isFollowing);
		if(isFollowing){
			$http({
				method : 'POST',
				url : '/deletefollowing',
				data : {
					deletefollowingusername : clickedFollowingUsername
				}
			}).success(function(data){
					console.log("in success of delete following user");
					console.log(data);
					if(data.statusCode == 401) {
						console.log("in statusCode=401");
						window.alert("ERROR!");
					}
					else if(data.statusCode == 200) {
						console.log("in statusCode=200");
						var loc = window.location.toString();
						console.log(loc);
						var locationString = loc.split("localhost:3000");
					   	console.log(locationString[1]);
					   	window.location.assign(locationString[1]);	
					}
			}).error(function(error){
				console.log("in error of delete following user");
			});
		} else {
			$http({
				method : 'POST',
				url : '/insertfollowing',
				data : {
					insertfollowingusername : clickedFollowingUsername
				}
			}).success(function(data){
					console.log("in success of insert following user");
					console.log(data);
					if(data.statusCode == 401) {
						console.log("in statusCode=401");
						window.alert("ERROR!");
					}
					else if(data.statusCode == 200) {
						console.log("in statusCode=200");
						var loc = window.location.toString();
						console.log(loc);
						var locationString = loc.split("localhost:3000");
					   	console.log(locationString[1]);
					   	window.location.assign(locationString[1]);	
					}
			}).error(function(error){
				console.log("in error of insert following user");
			});
		}
	}
});