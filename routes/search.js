var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
var Users = require('./model');

exports.userSearchResults = function(req, res) {

	console.log(req.param("searchUsername"));
	console.log("in userSearchResults node");

	var searchUsername = req.param("searchUsername");
	//var abc = req.param("tweet");

	//console.log(abc);
	console.log("searchUsername :: " + searchUsername);

	req.session.searchUsername = searchUsername;

	res.send({statusCode:200});

	
}

exports.usrSearchResults = function(req, res) {

	console.log("in usrSearchResults");

	//console.log(req.session.searchUsername);
	console.log("userid :: " + req.session.userid);
	console.log("searchUsername :: " + req.session.searchUsername);
	res.render("userSearchResults", {"searchUsername" : req.session.searchUsername, "username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.searchUser = function(req, res) {
	console.log("in userSearch node");

	//var searchUsername = req.session.searchUsername;
	//var searchUsername = "/.*" + req.param("searchUsername") + ".*/"; // /.*sh.*/ Finds the substring 'sh'	
	var searchUsername = req.session.searchUsername;
	console.log("searchUsername :: " + searchUsername);

	//Search by username
	Users.find({username : new RegExp('.*' + searchUsername + '.*', "i")}, function(err, data) { 
		if(err) {
			console.log("Error :: " + err);

			json_responses = {"statusCode" : 401};
			res.send(json_responses); 
		} else {
			console.log("data is :: " + data);
			console.log("data.length :: " + data.length);
			if(data) {
				if(data.length > 0) {
					Users.findOne({email : req.session.email}, function(err, currentuserdetails) {
						if(err) {
							console.log("Error during fetching Current User Details :: " + err);
						} else {
							if(currentuserdetails) {
								json_responses = {
									"statusCode" : 200, 
									"userid" : req.session.userid,
									"username" : req.session.username,
									"searchresult" : data,
									"searchUsername" : req.session.searchUsername,
									"currentuserfollowing" : currentuserdetails.following
								};
								res.send(json_responses);
							}
						}
					});
				} else {
					json_responses = {
									"statusCode" : 200, 
									"userid" : req.session.userid,
									"username" : req.session.username,
									"searchresult" : 0,
									"searchUsername" : req.session.searchUsername
								};	
					res.send(json_responses);
				}
				
			}
		}
	});
}

exports.searchHashTag = function(req, res) {
	console.log("in searchHashTag node");

	req.session.hashtag = "#" + req.param("hashtag");
	console.log("session hashtag :: " + req.session.hashtag);

	res.send({statusCode:200})
	//res.render("searchHash",  {"hashtag" : req.session.hashtag, "username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.srcHashTag = function(req, res) {
	
	console.log("in srcHashTag");

	console.log(req.session.hashtag);
	console.log(req.session.userid);

	res.render("searchHash",  {"hashtag" : req.session.hashtag, "username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});	
}

exports.searchHash = function(req, res) {
	console.log("in searchHash node");

	var tag = req.session.hashtag;
	var tagwithouthash = tag.split("#");
	console.log("tag is :: " + tag);
	console.log("tagwithouthash is :: " + tagwithouthash[1]);
	


	query = {'tweet.hashtag' : new RegExp('.*' + tagwithouthash[1] + '.*', "i")};
	Users.find(query, function(err, data) {
		if(err) {
			console.log("ERROR :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			console.log("data is :: " + data);

			var results = new Array();
			var indexresults = 0;
			var booleanforbreaking = false;

			if(data) {
				if(data.length>0) {
					for(indexuser in data){
						if(data[indexuser].tweet.length > 0){
							for(indextweet in data[indexuser].tweet){
								booleanforbreaking = false;
								for(indexhashtag in data[indexuser].tweet[indextweet].hashtag){
									var temp = data[indexuser].tweet[indextweet].hashtag[indexhashtag];
									var temphashtag = temp.split("#")[1];
									if(booleanforbreaking){
										continue;
									}
									if(temphashtag.indexOf(tagwithouthash[1]) > -1) {
										booleanforbreaking = true;
										/*console.log("ownername :: " + data[indexuser].tweet[indextweet].ownername);
										console.log("username :: " + data[indexuser].username);*/
										if(data[indexuser].tweet[indextweet].ownername == data[indexuser].username){ //checking if its retweeted or not
											results[indexresults] = {
												"name" : data[indexuser].firstname + " " +data[indexuser].lastname,
												"username" : data[indexuser].username,
												"tweetstring" : data[indexuser].tweet[indextweet].tweetstring,
												"tweetdate" : data[indexuser].tweet[indextweet].tweetdate,
												"isretweet" : false
											}
										} else {
											results[indexresults] = {
												"name" : data[indexuser].firstname + " " +data[indexuser].lastname,
												"username" : data[indexuser].username,
												"tweetstring" : data[indexuser].tweet[indextweet].tweetstring,
												"tweetdate" : data[indexuser].tweet[indextweet].tweetdate,
												"isretweet" : true,
												"ownerusername" : data[indexuser].tweet[indextweet].ownername,
												"originaltweetdate" : data[indexuser].tweet[indextweet].originaltweetdate
											}
										}
										console.log("----------------------------------------------------------------------------");
										//console.log("temphashtag :: " + temphashtag);
										console.log("index :: " + indexresults + "  || result ::");
										if(results[indexresults].isretweet){
											console.log("name :: " + results[indexresults].name);
											console.log("username :: " + results[indexresults].username);
											console.log("tweetstring :: " + results[indexresults].tweetstring);
											console.log("tweetdate :: " + results[indexresults].tweetdate);
											console.log("isretweet :: " + results[indexresults].isretweet);
											console.log("ownerusername :: " + results[indexresults].ownerusername);
											console.log("originaltweetdate :: " + results[indexresults].originaltweetdate);
										} else {
											console.log("name :: " + results[indexresults].name);
											console.log("username :: " + results[indexresults].username);
											console.log("tweetstring :: " + results[indexresults].tweetstring);
											console.log("tweetdate :: " + results[indexresults].tweetdate);
											console.log("isretweet :: " + results[indexresults].isretweet);
										}
										console.log("----------------------------------------------------------------------------");
										indexresults++;
									}
								}
							}
						}
					}
					json_responses = {"statusCode" : 200, "iduser" : req.session.userid, "username" : req.session.username, "results" : results};
					res.send(json_responses);
				} else {
					json_responses = {"statusCode" : 200, "iduser" : req.session.userid, "username" : req.session.username, "results" : 0};
					res.send(json_responses);
				}

				/*json_responses = {"statusCode" : 200, "iduser" : req.session.userid, "username" : req.session.username, "results" : data};
				res.send(json_responses);*/
			}
		}
	});
}