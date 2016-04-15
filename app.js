
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, path = require('path')
, mongoose = require('mongoose');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/test";	//test is database in mongoDB
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
//var mongo = require("./routes/mongo");
var home = require('./routes/home');
var profile = require('./routes/profile');
var tweet = require('./routes/tweet');
var search = require('./routes/search');

var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

//GET Requests
app.get('/', home.home);
app.post('/checklogin',home.checklogin);
app.get('/homepage', home.homepage);
app.get('/viewprofile',home.viewprofile);
app.post('/getprofiledetails',profile.getprofiledetails);
app.get('/logout', home.logout);
app.get('/signup',home.signup);
app.post('/dosignup', home.dosignup);
app.post('/doTweet',tweet.doTweet);
app.post('/getUserTweetsDetails',profile.getUserTweetsDetails);
//Get Tweet, Follower, Following Count
app.post('/gettweetfollowerfollowingcount', home.gettweetfollowerfollowingcount);
//User Search
app.get('/userSearchResults', search.userSearchResults);
app.get('/usrSearchResults', search.usrSearchResults);
app.get('/searchUser',search.searchUser);


//app.post('/gettweetcount', home.gettweetcount);


//app.post('/checksignup',home.checksignup);
//app.get('/', routes.index);
//app.get('/users', user.list);
//app.get('/homepage',login.redirectToHomepage);

//POST Requests
//app.post('/checklogin', login.checkLogin);
//app.post('/logout', login.logout);

//connect to the mongo collection session and then createServer
mongoose.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});



/*var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var home = require('./routes/home');
//var session = require('client-sessions');
var tweet = require('./routes/tweet');
var profile = require('./routes/profile');
var search = require('./routes/search');
var follower = require('./routes/follower');
var retweet = require('./routes/retweet');

var app = express();


//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/users";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");	//Database configuration file

app.use(expressSession({ 
	secret: 'cmpe273_teststring', 
	resave: false, //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000, 
	activeDuration: 5 * 60 * 1000, 
	store: new mongoStore({ 
		url: mongoSessionConnectURL 
		})
	}));

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){ 
	console.log('Connected to mongo at: ' + mongoSessionConnectURL); 
	http.createServer(app).listen(app.get('port'), function(){ 
		console.log('Express server listening on port ' + app.get('port')); 
		}); 
	});*/


/*// all environments
//configure the sessions with our application
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'twitter',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently*/

// all environments
/*app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());
app.use(express.cookieParser());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.home);
app.get('/signin', home.signin);
app.get('/signup',home.signup);
app.post('/checksignup',home.checksignup);
app.post('/aftersignup', home.aftersignup);
app.post('/checklogin',home.checklogin);
app.get('/homepage', home.homepage);
app.get('/logout', home.logout);
app.get('/viewprofile',home.viewprofile);

app.post('/doTweet',tweet.doTweet);
app.post('/getprofiledetails',profile.getprofiledetails);
app.post('/getUserTweetsDetails',profile.getUserTweetsDetails)

//User Search
app.post('/userSearchResults', search.userSearchResults);
app.get('/usrSearchResults', search.usrSearchResults);
app.get('/searchUser',search.searchUser);

//getFollowers
app.post('/getfollowingid',follower.getfollowingid);

//Hashtag Search

//insert and delete follower
app.post('/deletefollowing', follower.deletefollowing);
app.post('/insertfollowing', follower.insertfollowing);

//Get Tweet Count
app.post('/gettweetcount', home.gettweetcount);
app.post('/getfollowercount', home.getfollowercount);
app.post('/getfollowingcount', home.getfollowingcount);

//view follower, following pages
app.get('/viewfollowing',follower.viewfollowing);
app.get('/viewfollowers',follower.viewfollowers);

//get following and followers list
app.post('/getfollowing', follower.getfollowing);
app.post('/getfollower', follower.getfollower);

//get followers' tweets
app.post('/getfollowingtweets', follower.getfollowingtweets);

//get retweet details of a user
app.post('/getretweetdetails', retweet.getretweetdetails);

//delete and add retweet
app.post('/deleteretweet',retweet.deleteretweet);
app.post('/insertretweet', retweet.insertretweet);
//app.all('*',home.error);

//hashtag search
app.post("/searchHash", search.searchHash);
app.get("/srcHashTag",search.srcHashTag);
app.post("/searchHashTag", search.searchHashTag);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/
