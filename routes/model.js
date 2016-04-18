var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://localhost:27017/test');

autoIncrement.initialize(connection);

//Getter-Setter methods of HashTags
var getHashTag = function(hashtag) {
	return hashtag.split(',');
}

var setHashTag = function(hashtag) { 
	return hashtag.join(',');
}

var tweetSchema = new Schema({
	tweetid : Number,
	tweetstring : {
				type : String,
				required : true
			},

	tweetdate : {
					type : Date,
					default : Date.now
				},
	hashtag : {
				type : []
				//get:
				//set:
				//here getter and setter methods will get and set all the hashtags
			},
	retweetcount : {
					type : Number,
					default : 0
					},
	isretweet : {
					type : Boolean,
					required : false
				},
	//Data needed for retweet
	ownername : {
				type : String,
				required : false
				/*type : Schema.ObjectId,
				ref : 'users'*/
				},
	ownerfirstname : {
						type : String,
						required : false
					},
	ownerlastname : {
						type : String,
						required : false
					},
	originaltweetdate : {
							type : Date,
							required : false
						},

},{
	versionKey : false
});

var usersSchema = new Schema({
	username : {
					type : String,
					required : true
				},
	password : {
					type : String,
					required : true
				},
	firstname : {
					type : String,
					required : true
				},
	lastname : {
					type : String,
					required : false
				},
	email : {
				type : String,
				required : true
			},
	gender : {
				type : String,
				required : false
			},
	birthdate : {
					type : Date,
					required : false
				},
	location : {
					type : String,
					required : false
				},
	contact : {
				type : Number,
				required : false
			},
	follower : [
					{
						type : String //username of follwers
					}
			],
	following : [
					{
						type : String //username of follwing users
					}
			],
	tweet : [tweetSchema]
},{
	versionKey : false
});



//Model Creation
var Users = mongoose.model('users', usersSchema);
var Tweets = mongoose.model('tweets', tweetSchema);

usersSchema.plugin(autoIncrement.plugin, 'Users');
usersSchema.plugin(autoIncrement.plugin, {model : 'Users', field : 'tweet.tweetid'});

//Availability to the entire application
module.exports = Users;

/*var temp = 100;
Users.resetCount(function(err, temp) {
	if(err) console.log("Error :: " + err);
	else	console.log("temp :: " + temp);
});*/