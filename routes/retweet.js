var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
var Users = require('./model');

exports.getretweetdetails = function(req, res) {
	console.log("in getretweetdetails node");

	var getRetweetDetailsQuery = "select tweetid from retweets where retweeterid = " + req.session.userid;

	mysql.fetchData(function(err, results) {
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
					"results" : results
				};
				res.send(json_responses);
			}
			else {
				console.log("No User Tweets");
				json_responses = {
					"statusCode" : 401,
					"iduser" : req.session.userid,
					"results" : 0
				};
				console.log(json_responses);
				res.send(json_responses);
			}
		}
	}, getRetweetDetailsQuery);
}

exports.insertretweet = function(req,res) {
	console.log("in insertretweet node");

	var followingusername = req.param("followingusername");
	var tweetid = req.param("tweetid");
	var tweetstring = req.param("tweetstring");
	var tweetdate = req.param("tweetdate");

	console.log("followingusername :: " + followingusername);
	console.log("tweetid :: " + tweetid);
	console.log("tweetstring :: " + tweetstring);

	//Users.findOne({tweet._id : tweetid}, function(err, data) {
	Users.findOne({username : followingusername}, function(err, data) {
		if(err) {
			console.log("ERROR :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			console.log("data is :: " + data);
			if(data) {

				//updateing the retweetcount of a particular tweet by finding that tweet from tweet array
				for(var index = 0; index < data.tweet.length; index++) {
					if(data.tweet[index]._id == tweetid) {
						console.log("Before :: retweetcount :: " + data.tweet[index].retweetcount);
						var retweetcount = (data.tweet[index].retweetcount) + 1;
						var query = {'tweet._id' : tweetid};

						console.log("After :: retweetcount :: " + retweetcount);
						Users.update(query, {'$set' : {'tweet.$.retweetcount' : retweetcount}},	
							function(err, result) {
								if(err) {
									console.log("ERROR :: " + err);
									json_responses = {"statusCode" : 401};
									res.send(json_responses);
								} else {
									console.log("result is :: " + result);
									if(result) {
										Users.findOne({email : req.session.email}, function(err, currentuserdetails) {
											if(err) {
												console.log("ERROR :: " + err);
												json_responses = {"statusCode" : 401};
												res.send(json_responses);
											} else {
												console.log("currentuserdetails.username : " + currentuserdetails.username);
												if(currentuserdetails) {
													tempObject = new Object();

													tempObject["tweetstring"] = tweetstring;
													tempObject["hashtag"] = tweetstring.match(/#\w+/g);
													tempObject["originaltweetid"] = tweetid;
													tempObject["ownername"] = data.username;
													tempObject["ownerfirstname"] = data.firstname;
													tempObject["ownerlastname"] = data.lastname;
													tempObject["originaltweetdate"] = tweetdate;

													currentuserdetails.tweet.push(tempObject);
													currentuserdetails.save(function(err, resultretweetcountpush) {
														if(err) {
															console.log(err);
														} else {
															console.log("success :: " + resultretweetcountpush);
															if(resultretweetcountpush) {
																json_responses= {"statusCode" : 200};
																res.send(json_responses);
															}
														}
													});
												}
											}
										});
									}
								}
							}
						);
					}
				}
			}
		}
	});
}

exports.deleteretweet = function(req, res) {
	console.log("in deleteretweet node");

	var followingusername = req.param("followingusername");
	var tweetid = req.param("tweetid");
	var tweetstring = req.param("tweetstring");
	var tweetdate = req.param("tweetdate");

	console.log("followingusername :: " + followingusername);
	console.log("tweetid :: " + tweetid);
	console.log("tweetstring :: " + tweetstring);

	//Users.findOne({tweet._id : tweetid}, function(err, data) {
	Users.findOne({username : followingusername}, function(err, data) {
		if(err) {
			console.log("ERROR :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			console.log("data is :: " + data);
			if(data) {
				//updating the retweetcount of a particular tweet by finding that tweet from tweet array
				for(var index = 0; index < data.tweet.length; index++) {
					if(data.tweet[index]._id == tweetid) {
						
						console.log("Before :: retweetcount :: " + data.tweet[index].retweetcount);
						var retweetcount = (data.tweet[index].retweetcount) - 1;
						var query = {'tweet._id' : tweetid};
						var tweetdateforcondition = data.tweet[index].tweetdate;


						console.log("After :: retweetcount :: " + retweetcount);

						Users.update(query, {'$set' : {'tweet.$.retweetcount' : retweetcount}},
							function(err, result) {
								if(err) {
									console.log("ERROR :: " + err);
									json_responses = {"statusCode" : 401};
									res.send(json_responses);
								} else {
									console.log("result is :: " + result);

									if(result) {
										Users.findOne({email : req.session.email}, function(err, currentuserdetails) {
											if(err) {
												console.log("ERROR :: " + err);
												json_responses = {"statusCode" : 401};
												res.send(json_responses);
											} else {
												console.log("currentuserdetails.username : " + currentuserdetails.username);
												if(currentuserdetails) {
													//console.log("matched tweet :: " + data.tweet[index]);
													//console.log("matched tweetdate :: " + data.tweet[index].tweetdate);
													//var tweetdateforcondition = data.tweet[index].tweetdate;
													console.log("tweetdate :: " + tweetdateforcondition);
													Users.update({email : req.session.email}, 
														{'$pull' : {'tweet' : {'ownername' : followingusername, 'originaltweetdate' : tweetdateforcondition}}},
														function(err, resultretweetcurrentuser) {
															if(err) {
															console.log("ERROR :: " + err);
															json_responses = {"statusCode" : 401};
															res.send(json_responses);
														} else {
															console.log("resultretweetcurrentuser :: " + resultretweetcurrentuser);
															json_responses= {"statusCode" : 200};
															res.send(json_responses);
														}
														}
													);
												}
											}
										});
									}
								}
							}
						);
					}
				}
			}
		}
	});
}