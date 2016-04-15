var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
var mysql = require('./mysql');
var Users = require('./model');

//MongoDB
exports.getprofiledetails = function(req,res) {
	console.log("in getprofiledetails node");

	var email = req.session.email;
	var json_responses;
	console.log(req.session);
	console.log("email :: " + email);

	//mongo.connect(mongoURL, function() {
		//console.log('Connected to mongo at : ' + mongoURL);
		//var collection = mongo.collection('users');
		//console.log(collection);
		//collection.findOne({email : email}, function(err, data) {
		Users.findOne({email : email}, function(err, data) {
			if(err) {
				console.log("data is :: ");
				console.log(data);
				console.log(err);
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			} else {
				console.log("data is :: ");
				console.log(data);
				json_responses = {"statusCode" : 200, "data" : data};
				res.send(json_responses);
			}

			/*if(data) {
				// This way subsequent requests will know the user is logged in.
				console.log("data is :: ");
				console.log(data);
				json_responses = {"statusCode" : 200, "data" : data};
				res.send(json_responses);
			} else {
				console.log("data is :: ");
				console.log(data);
				console.log(err);
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}*/
		});
		//});
	//});

	/*mongo.connect(mongoURL, function() {
		console.log("Connected to mongo at : " + mongoURL);

		var collection = mongo.collection('users');
		console.log(collection);
		collection.findOne({email: email}, function(err, data) {
			if(data) {
				console.log("data is :: ");
				console.log(data);

				json_responses = {"statusCode" : 200, "data" : data};
				res.send(json_responses);
			} else {
				console.log("data is :: ");
				console.log(data);
				console.log(err);
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});*/
};


exports.getUserTweetsDetails = function(req,res) {
	console.log("in getUserTweetsDetails node");

	var email = req.session.email;
	console.log("email = " + email);
	//var getUserTweetsQuery = "select tweetid,tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time from tweets where userid=" + req.session.userid + " order by date DESC, time DESC";
	//var getUserTweetsQuery = "select * from ((select ownerid as userid, tweets.tweet,DATE_FORMAT(retweets.date,'%d/%m/%Y') as date_formatted,retweets.time as time from tweets, retweets where retweets.tweetid = tweets.tweetid and retweeterid=" + userid + ") UNION (select userid, tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time as time from tweets where userid=" + userid + ")) as t order by date_formatted DESC, time DESC";

	Users.findOne({email : email}, function(err, data) {
		if(err) {
			console.log("Error!! :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			console.log("Data Found :: " + data);

			if(data) {
				console.log("Tweets :: " + data.tweet);
				if(data.tweet.length < 1)
				{
					console.log("No Tweets Found!!");
					json_responses = {
						"statusCode" : 401,
						"iduser" : req.session.userid,
						"userTweets" : 0
					}
				} else {
					console.log(data.tweet.length + " Tweets Found!!");

					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"userTweets" : data
					};
					res.send(json_responses);

				}


				/*json_responses = {

				}
				res.send(json_responses);*/
			}
		}
	});

	/*mysql.fetchData(function(err, results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
					console.log("User Tweets Got Successfully");
					console.log(results);
					
					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"userTweets" : results
					};
					res.send(json_responses);
				}
				else {
					console.log("No User Tweets");
					json_responses = {
						"statusCode" : 401,
						"iduser" : req.session.userid,
						"tweet" : 0
					};
					console.log(json_responses);
					res.send(json_responses);
				}
			}
		}, getUserTweetsQuery);*/
}