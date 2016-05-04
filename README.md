##DC Roasters Coffee Beans E-Commerce Site
## Angular.js and Express.js
###E-Commerce Site built with Angular.js Front End FrameWork and Express.js as the BackEnd FranmeWork

##Got Express up and running and put compass in there - See other readme's for full instruction on installing Express
```
express coffee blah blah blah
```

###Configured Routes in index.js to render a Redistration Page and Login Page
```js
router.get('/register', function(req, res, next){
	res.render("register", {});
});
// POST
router.post('/register', function(req, res, next){
	// user posted: username, email, password, password2
	res.json(req.body);
	// res.render("register", {});
});
// Get route for the Login page
router.get('/login', function(req, res, next){
	res.render("login", {});
});
```
###Created Registration Page in register.jade our route points to
```jade
Blah Blah Blah
.row
	.col-sm-6.registration-form.text-center
		form(role="form", action="/register", method="post", id="registration-form", name="registration")
			.form-group
				label Username:
				input.form-control(type="text", name="username", placeholder="Will Bryant", minlength="5")
			.form-group
				label Password
				input.form-control(type="password", name="password", placeholder="6 character minimum", minlength="6")
Blah Blah BLah
```

###Installed mongoose`
```
npm install mongoose --save
```
###Configured Mongo and Mongoose in the index.js and Configure our DB and collection 
```js
var express = require('express');
var router = express.Router();
var mongoUrl = "mongodb://localhost27017/coffee"; // this will be the DB
var mongoose = require('mongoose');
var Account =require('../models/accounts');  //this is where we configure 
mogoose.connect(mongoUrl);
```
###Created mondels folder with accounts.js file
```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
	username: String,
	password: String,
	emailAddress: String
});
module.exports = mongoose.model('Account', Account);
```
###Configured in index.js Post data to save to Database
```js
router.post('/register', function(req, res, next){
	//The user posted: username, email, password, password2
	if(req.body.password != req.body.password2){
		res.redirect('/register?failure=password');
	}
	var newAccount = new Account({
		username: req.body.username,
		password: req.body.password,
		emailAddress: req.body.email
	});
	console.log(newAccount);
	newAccount.save();
	res.json(req.body);
	// res.render('register', {})
});
```
####Redirect to Register Page if Passwords Don't Match
```js
if(req.body.password != req.body.password2){
	res.redirect('/register?failure=password');
}
```
```jade
.row
	if(failure)
		h2 You must enter same password in both fields!
	.col-sm-6.registration-form.text-center
		form(role="form", action="/register", method="post", id="registration-form", name="registration")
```
###Or Redirect To Options Page
#####Make options page in options.jade and added _options.scss 
###Encrypt Pass Word Inserted into Mongo using bcrypt
```
sudo npm install brypt-nodejs --save
sudo npm install express-session --save
```
###Updated router.post config to contain bcrypt data
```js
router.post('/register', function(req, res, next) {
    //The user posted: username, email, password, password2
    if (req.body.password != req.body.password2) {
        res.redirect('/register?failure=password');
    } else {
        var newAccount = new Account({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password), 
            emailAddress: req.body.email
        });
		console.log(newAccount);
		newAccount.save();
		req.session.username =  req.body.username;
		res.redirect('/options');
    }
});
```
###Updated index.js and app.js config
####Updated index.js intro line (also removed line 7 to be put into app.js.)
```js
var express = require('express');
var router = express.Router();
var mongoUrl = "mongodb://localhost:27017/coffee";
var mongoose = require('mongoose');
var Account = require ('../models/accounts');
var bcrypt = require ('bcrypt-nodejs');
mongoose.connect(mongoUrl);
```
###Updated app.js file in the config and added app.use
```js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users'); 		//not sure
var session = require ('express-session'); 	//new
var app = express(); 				//new
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({	//new
  secret: 'dc-4life',   //new
  resave: false		//new
})); 
```

