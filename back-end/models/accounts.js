
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
	username: String,
	password: String,
	emailAddress: String,
	token: String,
	frequency: String,
	quantity: String, 
	grind: String,
	fullName: String,
	addressOne: String,
	addressTwo: String,
	usrCity: String,
	usrState: String,
	usrZip: String,
	deliveryDate: String

});

module.exports = mongoose.model('Account', Account);