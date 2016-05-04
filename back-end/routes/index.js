var express = require('express');
var router = express.Router();
var mongoUrl = "mongodb://localhost:27017/coffee";
var mongoose = require("mongoose");
var Account = require("../models/accounts");
var bcrypt = require("bcrypt-nodejs");
mongoose.connect(mongoUrl);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

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