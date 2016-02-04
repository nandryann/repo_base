var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	lastname : String,
	firstname : String,
  username : String,
	email : String,
	password : String,
	login_date : { type: Date, required: true, default: Date.now },
	type : { type: String, required: true, default: 'Customer'}
});

exports.User = mongoose.model('User', User);