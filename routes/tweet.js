var ejs = require("ejs");
var mysql = require('./mysql');
var mongoose = require('mongoose');
var mongoURL = "mongodb://localhost:27017/test";
var Users = require('./model');

exports.doTweet = function(req,res) {
	console.log("in doTweet");

	var tweetString = req.param("tweet");
	var email = req.session.email;
	console.log("tweet :: " + tweetString);
	console.log("email :: " + req.session.email);

	Users.findOne({email : email}, function(err, data) {
		
		if(err) {
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {

			if(data) {
				console.log("data found :: " + data);
				console.log("data.email :: " + data.email);
				console.log("tweet :: "  + tweetString);
				console.log("hashtag :: " + tweetString.match(/#\w+/g));

				//setting the tweetSchema Object to Push that Object into the document
				var tempObject = new Object();
				tempObject["tweetstring"] = tweetString;
				tempObject["hashtag"] = tweetString.match(/#\w+/g);
				tempObject["isretweet"] = false;
				tempObject["ownername"] = req.session.username;


				data.tweet.push(tempObject);
				data.save(function(err, result) {
					if(err) {
						console.log(err);
					} else {
						json_responses= {"statusCode" : 200};
						res.send(json_responses);
					}
				});

			}
		}
	});

	/*//var getUserIdQuery = "(select userid from users where email = '" + req.session.email + "')";
	var doTweetQuery = "insert into tweets (userid, tweet, date, time) values (" + req.session.userid + ",'" + tweet + "', CURDATE(), CURTIME())";

	console.log("Query :: " + doTweetQuery);

	mysql.storeData(doTweetQuery, function(err, results) {
		if(!err) {
			console.log("Valid Tweet Operation!");
			json_responses = {"statusCode" : 200};

			var taglistarray = tweet.match(/#\S+/g);
			for(tag in taglistarray) {
				handleHashtag(taglistarray[tag], req.session.userid);
			}

			res.send(json_responses);
		}
		else {
			console.log("Invalid Tweet Operation!");
			console.log(err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	});*/
};

var handleHashtag = function(tag, userid) {

	var getTweetIdQuery = "select max(tweetid) from tweets where userid=" + userid;
	var insertTagQuery = "insert into hashtag (tweetid, hashtagstring) values((" + getTweetIdQuery + "),'" + tag + "')";

	mysql.storeData(insertTagQuery, function(err, result){
		//render on success
		if(!err){
			console.log('New Following user successfully added!');
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});


}