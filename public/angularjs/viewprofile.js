console.log("in viewprofile controller");

var viewprofile = angular.module('viewprofile',['ngRoute']);

viewprofile.controller('viewprofile', function($scope, $http, $route, $location, $sce) {
	

	var searchHash = function(tag){
		console.log("tag :: " + tag);
		window.alert("This is clicked");
	}

	$scope.toTrustedHTML = function (html) {
    	return $sce.trustAsHtml(html);
  	};

	console.log("in view profile controller");

	//for doTweet
	var loc = window.location.toString();
	console.log(loc);
	var array = loc.split("localhost:3000");
    console.log(array[1]);

	$http({
		method : 'POST',
		url : '/getprofiledetails'
	}).success(function(data) {
		console.log("in success of getprofiledetails http method");
		console.log(data);
		if(data.statusCode==200) {
			//setting the profile data
			$scope.username=data.data.username;
			$scope.name=data.data.firstname + " " + data.data.lastname;
			$scope.email="Email : " + data.data.email;
			$scope.gender="Gender : " + data.data.gender;
			$scope.birthdate = null;
			$scope.location = null;
			$scope.contact = null;

			if(data.data.birthdate != '' || data.data.location != null)
			{	
				var birthdate = data.data.birthdate;
				birthdate = birthdate.split("T");
				$scope.birthdate = "Birthdate : " + birthdate[0];
			}
			if(data.data.location != '' || data.data.location != null) {
				$scope.location = "Location : " + data.data.location; 
			}
			if(data.data.contact != '' || data.data.contact != null) {
				$scope.contact = "Contact : " + data.data.contact;
			}
		}
		else if(data.statusCode==401) {
			console.log("ERROR :: statusCode=401");
		}

	}).error(function(error) {
		console.log("in error of getprofiledetails http method");
		console.log(error);
	});

	$http({
		method : 'POST',
		url : '/getUserTweetsDetails'
	}).success(function(data) {
		console.log("in get User tweets success");
		console.log(data);
		if(data.statusCode==200) {

			//setting the user tweets data
			$scope.tweets = data.userTweets.tweet.reverse();
			console.log("Tweets :: " + $scope.tweets);
			console.log("User Tweets :: " + data.userTweets);

			var i=0;
			for(temp in data.userTweets.tweet) {
				
				console.log("temp :: " + i + "  :: " + temp);
				console.log("tweet :: " + data.userTweets.tweet[temp].tweetstring);
				var tagslistarr = data.userTweets.tweet[temp].tweetstring.match(/#\S+/g);
				console.log("tagslistarr :: " + tagslistarr);
				for(tag in tagslistarr) {
				//	//$scope.tweet[temp] = $scope.tweet[temp].replace(tagslistarr[tag],"<a href='/searchHash?hashtag='" + tagslistarr[tag] + "''>" + tagslistarr[tag] + "</a>");
					$scope.tweets[temp].tweetstring = $scope.tweets[temp].tweetstring.replace(tagslistarr[tag],"<a href = '/hashtag?keywor=" + tagslistarr[tag].substr(1) + "'>" + tagslistarr[tag] + "</a>");
					console.log("After Replacing tweet :: " + $scope.tweets[temp].tweetstring);
				//	console.log($scope.tweet);
				}
				i++;
			}

			//var index=0;

			/*isretweet
			ownerid
			retweetcount
			tweetdate
			tweetstring*/


			/*angular.forEach(data.userTweets, function(value, key) {
				console.log(value);
			});*/

			/*var date = data.data.birthdate;
				birthdate = birthdate.split("T");*/


			/*//setting the user tweets data
			$scope.tweet = new Array();
			$scope.date_formatted = new Array();
			$scope.time = new Array();
			$scope.tweeterid = new Array();
			$scope.userid = data.iduser;
			var index=0;
			
			angular.forEach(data.userTweets, function(value, key) {
				console.log(value.tweet);
				console.log(value.date_formatted);
				console.log(value.time);
				console.log(value.userid);
				
				$scope.tweet[index] = value.tweet;
				$scope.date_formatted[index] = value.date_formatted;
				$scope.time[index] = value.time;
				$scope.tweeterid[index] = value.userid;

				index++;
			});

			console.log($scope.tweet);
			console.log($scope.date_formatted);
			console.log($scope.time);
			console.log($scope.tweeterid);

			for(temp in $scope.tweet) {
				var tagslistarr = $scope.tweet[temp].match(/#\S+/g);
				console.log("tagslistarr :: " + tagslistarr);
				for(tag in tagslistarr) {
					//$scope.tweet[temp] = $scope.tweet[temp].replace(tagslistarr[tag],"<a href='/searchHash?hashtag='" + tagslistarr[tag] + "''>" + tagslistarr[tag] + "</a>");
					$scope.tweet[temp] = $scope.tweet[temp].replace(tagslistarr[tag],"<button type= \"submit\" class=\"btn btn-link\" ng-click=\"searchHash(\'"+ tagslistarr[tag] + "\');\">" + tagslistarr[tag] + "</button>");
					console.log($scope.tweet);
				}
			}*/
		}
		else if(data.statusCode==401) {
			console.log("ERROR :: statusCode=401");
			$scope.tweets = data.userTweets;
		}

	}).error(function(error) {
		console.log("in get User tweets error");
		console.log(error);
	});

	

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
				method : "POST",
				url : "/userSearchResults",
				data : {
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


					//window.location.assign("/hashtagSearchResults/?hashtag=" + searchString);
				}
			}
		}
	};


});