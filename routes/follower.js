var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
var Users = require('./model');

exports.getfollowingid = function(req, res) {
	console.log("in getfollowerid node");

	var userid = req.session.userid;
	var getFollowerQuery = "select followingid from follow where followerid=" + userid;

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("Error in fetchData");
				console.log(err);
				throw err;
			}
			else {
				console.log("success in query firing");
				console.log(results);

				if(results.length >0) {
					console.log("User(s) found");
					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"results" : results
					}
					console.log(json_responses);
					res.send(json_responses);
				}
				else
				{
					json_responses = {
						"statusCode" : 401
					}
					res.send(json_responses);
				}
			}
	},getFollowerQuery);
}

exports.deletefollowing = function(req, res) {
	console.log("in delete Following node");


	var deletefollowingusername = req.param("deletefollowingusername");
	console.log("deletefollowingusername :: " + deletefollowingusername);

	//Users.update({email : req.session.email}, {$pull : {following : [deletefollowingusername]}});

	Users.findOne({email : req.session.email}, function(err, data) {
		if(err) {
			console.log("Error :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			console.log("data is :: " + data);
			if(data) {

				var tempObject = new Object();
				tempObject = deletefollowingusername;
				data.following.pull(tempObject);

				data.save(function(err, result) {
					if(err) {
						console.log("Error in pushing Follwing username :: " + err);
						json_responses = {"statusCode" : 401};
						res.send(json_responses);		
					} else {
						console.log("Following username successfully pulled :: " + result);
						
						Users.findOne({username : deletefollowingusername}, function(err, followerdelete) {
							if(err) {
								console.log("Error in finding follower details ::" + err);
								json_responses = {"statusCode" : 401};
								res.send(json_responses);
							} else {
								console.log("follower details successfully found :: " + followerdelete);

								tempObject = req.session.username;
								console.log("Temp Object for deleting follower username:: " + tempObject);
								followerdelete.follower.pull(tempObject);

								followerdelete.save(function(err, resultfollowerpull) {
									if(err) {
											console.log("Error in pulling Follower username :: " + err);
											json_responses = {"statusCode" : 401};
											res.send(json_responses);
										} else {
											if(resultfollowerpull) {
												console.log("Follower username successfully pulled :: " + resultfollowerpull);
												json_responses= {"statusCode" : 200};
												res.send(json_responses);
											}
										}
								});

							}
						});
						/*json_responses= {"statusCode" : 200};
						res.send(json_responses);*/
					}
				})
			}
		}
	});

	/*var deletefollowingid = req.param("deletefollowingid");
	console.log(deletefollowingid);

	var deletefollowingquery = "delete from follow where followingid=" + deletefollowingid + " and followerid=" + req.session.userid;

	mysql.deleteData(deletefollowingquery, function(err,results) {
		if(err) {
				console.log("Error in deleteData");
				console.log(err);
				throw err;
			}
		else {
			console.log("successfully Unfollowed");
			console.log(results);
			console.log(results.affectedRows);
			if(results.affectedRows >0) {
				json_responses = {
					"statusCode" : 200,
					"results" : results
				}
				res.send(json_responses);
			}
			else{
				json_responses = {
					"statusCode" : 401
				}
				res.send(json_responses);
			}
		}
	});
*/
}

exports.insertfollowing = function(req, res) {
	console.log("in insert Following node");

	var insertfollowingusername = req.param("insertfollowingusername");
	console.log("insertfollowingusername :: " + insertfollowingusername);

	Users.findOne({email : req.session.email}, function(err, data) {
		if(err) {
			console.log("Error :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			console.log("data is :: " + data);
			if(data) {

				var tempObject = new Object();
				tempObject = insertfollowingusername;

				data.following.push(tempObject);
				data.save(function(err, result) {
					if(err) {
						console.log("Error in pushing Follwing username :: " + err);
						json_responses = {"statusCode" : 401};
						res.send(json_responses);		
					} else {
						console.log("Following username successfully pushed :: " + result);
						Users.findOne({username : insertfollowingusername}, function(err, followerinsert) {
							if(err) {
								console.log("Error in finding Follwer details :: " + err);
								json_responses = {"statusCode" : 401};
								res.send(json_responses);
							} else {
								if(followerinsert) {
									console.log("follower details successfully found :: " + followerinsert);
									tempObject = req.session.username;
									console.log("Temp Object for inserting follower username:: " + tempObject);
									followerinsert.follower.push(tempObject);
									followerinsert.save(function(err, resultfollowerpush) {
										if(err) {
											console.log("Error in pushing Follower username :: " + err);
											json_responses = {"statusCode" : 401};
											res.send(json_responses);
										} else {
											if(resultfollowerpush) {
												console.log("Follower username successfully pushed :: " + resultfollowerpush);
												json_responses= {"statusCode" : 200};
												res.send(json_responses);
											}
										}
									});
								}
							}
						});
					}
				})
			}
		}
	});
	/*var insertfollowingquery = "insert into follow (followerid, followingid) values(" + req.session.userid + "," + insertfollowingid + ")";

	mysql.storeData(insertfollowingquery, function(err, result){
		//render on success
		if(!err){
			console.log('New Following user successfully added!');
				json_responses = {
					"statusCode" : 200
				}
				res.send(json_responses);
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});*/

}

exports.viewfollowing = function(req, res) {
	console.log("in viewfollowing node");

	res.render("viewfollowing",{"username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.viewfollowers = function(req, res) {
	console.log("in viewfollowers node")

	res.render("viewfollowers",{"username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.getfollowing = function(req, res) {
	console.log("in getfollowing node");
	
	var email = req.session.email;
	console.log("email :: " + email);


	Users.findOne({email : email}, function(err, data){
		if(err) {
			console.log("ERROR :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			if(data) {
				if(data.following.length>0){
					Users.find({username : {$in : data.following}}, function(err, followingdetails) {
						if(err) {
							console.log("Error :: " + err);
							json_responses = {"statusCode" : 401};
							res.send(json_responses);		
						} else {
							console.log("Following details :: " + followingdetails);
							json_responses = {"statusCode" : 200, following : followingdetails};
							res.send(json_responses);
						}
					});
				} else {
					json_responses = {"statusCode" : 200, following : 0};
					res.send(json_responses);
				}
				
			}
		}
	});

	/*var userid = req.session.userid;
	var getFollowingIdQuery = "select followingid from follow where followerid=" + userid;
	var getFollowingDetailsQuery = "select userid, username, firstname, lastname from users where userid in (" + getFollowingIdQuery + ") order by firstname";

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("Error in fetchData");
				console.log(err);
				throw err;
			}
			else {
				console.log("success in query firing");
				console.log(results);

				if(results.length >0) {
					console.log("Following User(s) details found");
					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"results" : results
					}
					console.log(json_responses);
					res.send(json_responses);
				}
				else
				{
					json_responses = {
						"statusCode" : 401
					}
					res.send(json_responses);
				}
			}
	},getFollowingDetailsQuery);*/
}

exports.getfollower = function(req, res) {
	console.log("in getfollower node");
	
	var email = req.session.email;
	console.log("email :: " + email);


	Users.findOne({email : email}, function(err, data){
		if(err) {
			console.log("ERROR :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			if(data) {
				if(data.follower.length>0){
					Users.find({username : {$in : data.follower}}, function(err, followerdetails) {
						if(err) {
							console.log("Error :: " + err);
							json_responses = {"statusCode" : 401};
							res.send(json_responses);		
						} else {
							console.log("Follower details :: " + followerdetails);
							json_responses = {"statusCode" : 200, follower : followerdetails, following : data.following};
							res.send(json_responses);
						}
					});
				} else {
					json_responses = {"statusCode" : 200, follower : 0};
					res.send(json_responses);
				}
			}
		}
	});

	/*var userid = req.session.userid;
	var getFollowerIdQuery = "select followerid from follow where followingid=" + userid;
	var getFollowerDetailsQuery = "select userid, username, firstname, lastname from users where userid in (" + getFollowerIdQuery + ") order by firstname";

	mysql.fetchData(function(err,results) {
			if(err) {
				console.log("Error in fetchData");
				console.log(err);
				throw err;
			}
			else {
				console.log("success in query firing");
				console.log(results);

				if(results.length >0) {
					console.log("Follower User(s) details found");
					json_responses = {
						"statusCode" : 200,
						"iduser" : req.session.userid,
						"results" : results
					}
					console.log(json_responses);
					res.send(json_responses);
				}
				else
				{
					json_responses = {
						"statusCode" : 401
					}
					res.send(json_responses);
				}
			}
	},getFollowerDetailsQuery);*/
}

exports.getfollowingtweets = function(req, res) {
	console.log("in getfollowingtweets node");

	Users.findOne({email : req.session.email}, function(err, data) {
		if(err) {
			console.log("Error :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			if(data) {
				Users.find({username : {$in : data.following}}, function(err, followingdetails) {
					if(err) {
						console.log("Error of followingdetails:: " + err);
						json_responses = {"statusCode" : 401};
						res.send(json_responses);
					} else {
						console.log("Following details in getfollowingtweets :: " + followingdetails);
						
						if(followingdetails.length > 0)
						{
							json_responses = {"statusCode" : 200, currentuserdetails : data, followingdetails : followingdetails};
							res.send(json_responses);
						} else {
							json_responses = {"statusCode" : 200, followingdetails : 0};
							res.send(json_responses);
						}
					}
				});
			}
		}
	});	

	/*var userid = req.session.userid;
	var getFollowingIdQuery = "select followingid from follow where followerid=" + userid;
	//var getFollowingTweetsQuery = "select tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time from tweets where userid in ("+ getFollowingIdQuery + ") order by date DESC, time DESC";
	var getFollowingTweetsQuery = "select users.username,tweets.tweetid,tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time from tweets,users where tweets.userid in (" + getFollowingIdQuery + ")  and users.userid= tweets.userid order by date DESC, time DESC";

	mysql.fetchData(function(err, results){
		if(err) {
			console.log("Error in fetchData");
			console.log(err);
			throw err;
		}
		else {
			console.log("success in query firing");
			console.log(results);

			if(results.length >0) {
				console.log("Following User(s) tweets found");
				json_responses = {
					"statusCode" : 200,
					"iduser" : req.session.userid,
					"results" : results
				}
				console.log(json_responses);
				res.send(json_responses);
			}
			else
			{
				json_responses = {
					"statusCode" : 401
				}
				res.send(json_responses);
			}
		}
	},getFollowingTweetsQuery);*/
}