#DC Roasters Coffee Beans E-Commerce Site (conversion of ('coffee-express')
###This is an E-Commerce Site with Angular.js Front End FrameWork and Express.js as the BackEnd FrameWork
###Converting "coffee-express" built only with Express into Front-End with Angular.js and Back-End with Express
#####Created Front End and Back End Directories
#####Setup Angular.js in the Front End Folder
#####In index.html created header and footer - with 'ng-view' between. We will switch between main.html, login.html, register.html, options.html, etc. - converted from JADE into html.
#####Configured controller.js to handle these routes
```js
coffeeApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: "views/main.html",
        controller: 'coffeeController'
    })
    .when('/register', {
        templateUrl: "views/register.html",
        controller: 'coffeeController'        
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'coffeeController'
     }).when('/options', {
        templateUrl: "views/options.html",
        controller: 'coffeeController'        
    });

});
```
####Configured login and register functions to send http requests to MY server I control.
```js
var coffeeApp = angular.module('coffeeApp', ['ngRoute']);
// var apiUrl = 'http://localhost:3020/';
coffeeApp.controller('coffeeController', function($scope, $http, $location) {

    $scope.loginForm = function(){
        $http.post('http://localhost:3000/login', {
            username: $scope.username,
            password: $scope.password
        }).then(function successCallback(response){
            console.log(response.data);
            if(response.data.success == 'found'){
                $location.path('/options');
            }else if(response.data.failure == 'noUser'){
                $scope.errorMessage = 'No such user in th db';
            }else if(response.data.failure == 'badPassword'){
                $scope.errorMessage = 'Bad password for this user.';

            }
        }, function errorCallback(response){

        });
    };

   $scope.registerForm = function(){
        console.log($scope.username);
        $http.post('http://localhost:3000/register', {
            username: $scope.username,
            password: $scope.password,
            password2: $scope.password2,
            email: $scope.email
        }).then(function successCallback(response){
            console.log(response.data.failure);
            if(response.data.failure == 'passwordMatch'){
                $scope.errorMessage = 'Your passwords must match.';
            }else if(response.data.success == 'added'){
                $location.path('/options');
            }
        }, function errorCallback(response){
            console.log(response.status);
        });
    };
});
```
###Got Express up. See other readme's for full instruction on installing Express
```
express coffee blah blah blah
```
###Configured Routes in express to handle Post requests coming from Angular - Registration Page and Login Page
```js
router.post("/register", function(req, res, next){
	if(req.body.password != req.body.password2){
		res.json({"failure": "passwordMatch"});
	}else{
		var newAccount = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			email: req.body.email
		});
		newAccount.save();
		req.session.username = req.body.username;
		res.json({
			success: "added"
		});
	}
});
router.post("/login", function(req, res, next){
	Account.findOne(
		{username: req.body.username}, function(err, doc){
			if(doc == null){
				res.json({failure: "noUser"});
			}else{
				var passwordsMatch = bcrypt.compareSync(req.body.password, doc.password);
				if(passwordsMatch){
					req.session.username = req.body.username;
					res.json({
						success: "found"
					});
				}else{
					res.json({failure: "badPassword"});
				}
			}
		} 
	);
});
module.exports = router;
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
###Encrypt Pass Word Inserted into Mongo using bcrypt
```
sudo npm install brypt-nodejs --save
sudo npm install express-session --save
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
###Updated app.js file in the config and added app.use and allowed from cross origin headers
```js
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

var session = require ('express-session'); 	//new
var app = express(); 				//new
app.use(session({	//new
  secret: 'dc-4life',   //new
  resave: false		//new
})); 
```

