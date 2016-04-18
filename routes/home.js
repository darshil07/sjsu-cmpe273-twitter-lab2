var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
var bcrypt = require('./bCrypt.js')
var Users = require('./model');

exports.home = function (req,res) {
	
	if(req.session.username && req.session.email && req.session.userid) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
		//here all the data should be post
		res.render("homepage",{username : req.session.username, userid : req.session.userid,email : req.session.email});
	}
	else {
		ejs.renderFile('./views/home.ejs',function(err, result) {
			   // render on success
			   if (!err) {
			            res.end(result);
			   }
			   // render or error
			   else {
			            res.end('An error occurred');
			            console.log(err);
			   }
		   });
	}
}

exports.homepage = function(req,res) {
	console.log(req.session.username);
	console.log(req.session.email);
	console.log(req.session.userid);

	if(req.session.username && req.session.email && req.session.userid) {
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
		//here all the data should be post
		res.render("homepage",{username : req.session.username, userid : req.session.userid,email : req.session.email});
		
	}
	else {
		res.redirect('/');
	}
}

exports.logout = function(req,res) {
	console.log("in logout");
	req.session.destroy();
	
	res.redirect("/");
}

//done using MongoDB
exports.checklogin = function (req,res) {

	console.log("in checklogin");

	var emailCheck = req.param("email");
	var passwordCheck = req.param("password");
	var json_responses;
	
	console.log("email :: " + emailCheck);
	console.log("password :: " + passwordCheck);

	if(emailCheck != '') {
		//mongo.connect(mongoURL, function() {
			//console.log('Connected to mongo at : ' + mongoURL);
			//var collection = mongo.collection('users');
			//console.log(collection);
			//collection.findOne({email : emailCheck, password : passwordCheck}, function(err, data) {
			
			Users.findOne({email : emailCheck, password : passwordCheck}, function(err, data) {
				
				/*if(err) {
					console.log("data is :: ");
					console.log(data);
					console.log(err);
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				} else {
					console.log("data is :: ");
					console.log(data);
					req.session.username = data.username;
					req.session.email = data.email;
					req.session.userid = data._id;
					json_responses = {"statusCode" : 200};
					res.send(json_responses);
				}*/
				if(data) {
					// This way subsequent requests will know the user is logged in.
					console.log("data is :: ");
					console.log(data);
					req.session.username = data.username;
					req.session.email = data.email;
					req.session.userid = data._id;
					json_responses = {"statusCode" : 200};
					res.send(json_responses);
				} else {
					console.log("data is :: ");
					console.log(data);
					console.log(err);
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
			});

			//});
		//});
	}
}

exports.viewprofile = function(req,res) {
	console.log("in view profile node");
	if(req.session.username && req.session.email && req.session.userid) {
		var email = req.session.email;
	
		console.log("email :: " + email);
	
		if(email != '') {
			
			res.render('viewprofile',{userid:req.session.userid,username:req.session.username,email : req.session.email});
			
		}
	} else{
		res.redirect("/");
	}
}

exports.signup = function(req,res) {

	//console.log("isEmailExists :: " + req.param("isEmailExists"));
	ejs.renderFile('./views/signup.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   //render or error
	   else {
	            res.end('An error occurred during rendering signup Page!');
	            console.log(err);
	   }
   });
}

exports.dosignup = function(req,res) {

	//request parameters
	var newUser = req.param("newUser");

	console.log(newUser);
	console.log("username :: " + newUser[0].username);

	if(newUser[0].email!='') {
		
		//mongo.connect(mongoURL, function() {
			//console.log('Connected to mongo at : ' + mongoURL);
			//var collection = mongo.collection('users');
			//console.log(collection);

			//checking for username first
			//collection.findOne({username : newUser[0].username}, function(err, data) {
			//collection.findOne({$or : [{email : emailCheck}, {username : newUser[0].username}]}, function(err, data) {	
			Users.findOne({username : newUser[0].username}, function(err, data) {

				/*if(err) {
					checkEmailExist(false, newUser[0].email, res);
				} else {
					checkEmailExist(true, newUser[0].email, res);
				}*/

				if(data) {
					checkEmailExist(true, newUser, res);
				} else {
					checkEmailExist(false, newUser, res);
				}
			});
			//});
		//});
	}
	
}

function checkEmailExist(isUsernameExist, newUser, res) {
	
	console.log("in checkEmailExist");
	console.log("email is :: " + newUser[0].email);

	//mongo.connect(mongoURL, function() {
		//console.log('Connected to mongo at : ' + mongoURL);
		//var collection = mongo.collection('users');
		//console.log(collection);

		//checking for email first
		//collection.findOne({email : emailCheck}, function(err, data) {
		Users.findOne({email : newUser[0].email}, function(err, data) {
			
			/*if(err) {
				console.log("data is :: ");
				console.log(data);
				console.log(err);

				if(isUsernameExist)
					json_responses = {"statusCode" : 200, "isEmailExist" : false, "isUsernameExist" : isUsernameExist};
				else {
					json_responses = {"statusCode" : 401};
					doSignup(newUser);
				}
				res.send(json_responses);
			} else {
				console.log("data is :: ");
				console.log(data);
				
				if(isUsernameExist)
					json_responses = {"statusCode" : 200, "isEmailExist" : true, "isUsernameExist" : true};
				else
					json_responses = {"statusCode" : 200, "isEmailExist" : true, "isUsernameExist" : false};
				res.send(json_responses);
			}*/

			if(data) {
				console.log("data is :: ");
				console.log(data);
				
				if(isUsernameExist)
					json_responses = {"statusCode" : 200, "isEmailExist" : true, "isUsernameExist" : true};
				else
					json_responses = {"statusCode" : 200, "isEmailExist" : true, "isUsernameExist" : false};
				res.send(json_responses);
				
			} else {
				console.log("data is :: ");
				console.log(data);
				console.log(err);

				if(isUsernameExist)
					json_responses = {"statusCode" : 200, "isEmailExist" : false, "isUsernameExist" : isUsernameExist};
				else {
					json_responses = {"statusCode" : 401};
					doSignup(newUser, res);
				}
				res.send(json_responses);
			}
		});
		//});
	//});
}

var doSignup = function(newUser, res) {
	console.log("in doSignUp function");
	console.log("New User Details :: ");
	console.log(newUser[0]);

	//Signing up the NEW user
	var usernew = new Users({
		username : "@" + newUser[0].username,
		password : newUser[0].password,
		firstname : newUser[0].firstname,
		lastname : newUser[0].lastname,
		email : newUser[0].email,
		gender : newUser[0].gender,
		birthdate : new Date(newUser[0].birthdate),
		contact : newUser[0].contact,
		location : newUser[0].location
	});
	
	usernew.save(function(err, usernew) {
		if(err) {
			console.log("Error in Signing Up!!");
			console.log(err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			/*usernew.resetCount(function(err, nextCount) {
				if(err)	console.log("Error :: " + err);
				else	console.log("Next Count :: " + nextCount);
			});*/
			console.log("Successfully Signed Up!!");
			json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
	});
}


exports.gettweetfollowerfollowingcount = function(req, res) {
	console.log("in home.gettweetfollowerfollowingcount node");
	//var getTweetCountQuery = "select count(tweet) as countoftweets from tweets where userid=" + req.session.userid;
	
	Users.findOne({email : req.session.email}, function(err, data) {
		
		if(err) {
			console.log("Error :: " + err);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		} else {
			//console.log("data is :: " + data);

			console.log("Tweet Count :: " + data.tweet.length);
			console.log("Follower Count :: " + data.follower.length);
			console.log("Following Count :: " + data.following.length);

			json_responses = {
								"statusCode" : 200, 
								"tweetcount" : data.tweet.length, 
								"followercount" : data.follower.length, 
								"followingcount" : data.following.length
							};
			res.send(json_responses);
		}

	});
}











function aftersignup(req, res) {
	console.log("In aftersignup");

	var username = req.param("username");
	var lastname = req.param("lastname");
	var firstname = req.param("firstname");
	var email = req.param("email");
	var gender = req.param("gender");
	var password = req.param("password");
	var birthdate = req.param("birthdate");
	var contact = req.param("contact");
	var location = req.param("location");

	console.log("username :: " + username);
	console.log("lastname :: " + lastname);
	console.log("firstname :: " + firstname);
	console.log("password :: " + password);
	console.log("email :: " + email);
	console.log("gender :: " + gender);
	console.log("contact :: " + contact);
	console.log("birthday :: " + birthdate);
	console.log("location : " + location);

	var hash = bcrypt.hashSync(password);

	var query = "INSERT INTO users (username, password, firstname, lastname, email, gender, birthdate, location, contact) VALUES ('" + username + "','" + hash + "','" + firstname + "','" + lastname + "','" + email + "','" + gender + "','" + birthdate + "','" + location + "','" + contact  + "')";
	console.log("Query:: " + query);

	mysql.storeData(query, function(err, result){
		//render on success
		if(!err){
			console.log('Valid SignUp!');
			/*ejs.renderFile('./views/successSignUp.ejs', {data : result}, function(err, result){
				//render on success
				if(!err){
					res.end(result);
				}
				//render or error
				else{
					res.end('Error occurred during successSignUp.ejs');
					console.log(err);
				}
			});*/
			res.send("true");
		}
		//render or error
		else{
			console.log('Invalid SingUp!');
			/*ejs.renderFile('./views/failSignUp.ejs', function(err, result){
				//render on success
				if(!err){
					res.end(result);
				}
				//render or error
				else{
					res.end('Error occurred during failSignUp.ejs');
					console.log(err);
				}
			});*/
			res.send("false");
		}
	});
}








function error(req, res) {
	ejs.renderFile('./views/errorpage.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

exports.aftersignup=aftersignup;
exports.error = error;
//exports.failsignUp=failsignup;