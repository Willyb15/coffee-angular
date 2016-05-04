
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
	username: String,
	password: String,
	emailAddress: String
});

module.exports = mongoose.model('Account', Account);