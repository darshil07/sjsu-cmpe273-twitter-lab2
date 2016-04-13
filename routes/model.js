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
			},
	date : {
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
	ownerid : {
				type : Schema.ObjectId,
				ref : 'users'
				}
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
						type : Schema.ObjectId,
						ref : 'users'
					}
			],
	following : [
					{
						type : Schema.ObjectId,
						ref : 'users'
					}
			],
	tweet : [tweetSchema]
});



//Model Creation
var Users = mongoose.model('users', usersSchema);
var Tweets = mongoose.model('tweets', tweetSchema);

usersSchema.plugin(autoIncrement.plugin, 'Users');
tweetSchema.plugin(autoIncrement.plugin, {model : 'Tweets', field : 'tweetid'});

//Availability to the entire application
module.exports = Users;