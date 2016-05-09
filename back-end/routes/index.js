var express = require('express');
var router = express.Router();
var mongoUrl = "mongodb://willybman.com:27017/coffee";
var mongoose = require("mongoose");
var Account = require("../models/accounts");
var bcrypt = require("bcrypt-nodejs");
mongoose.connect(mongoUrl);
// create a token generator with the defualt settings
var randtoken = require('rand-token');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/getUserData', function(req, res, next){
    console.log(req.query.token);
    if(req.query.token === undefined){
        res.json({'failure':"noToken"});
    }else{
        Account.findOne(
            {token: req.query.token},
            function (err, doc){
                if(doc === null){
                    res.json({failure:"badToken"});
                }else{
                    res.json(doc);
                }
            }
        );
    }
});

// router.get("/register", function(req, res, next){
//     res.json({message:'Hello Will. This JSON response to your GET the /register router'});
// });

router.post("/register", function(req, res, next) {
    // res.json({message:'Hello Will'});
    if (req.body.password != req.body.password2) {
        res.json({
            "failure": "passwordMatch"
        });
    } else {
        var token = randtoken.generate(16);
        var newAccount = new Account({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            email: req.body.email,
            token: token
        });
        newAccount.save();
        req.session.username = req.body.username;
        res.json({
            success: "added",
            token: token
        });
    }
});

// router.get("/login", function(req, res, next){
//     res.json({message:'Hello Will. This is  JSONn response of your GET to the /login router'});
// });

router.post("/login", function(req, res, next) {
    Account.findOne({
        username: req.body.username
    }, function(err, doc) {
        if (doc === null) {
            res.json({
                failure: "noUser"
            });
        } else {
            var passwordsMatch = bcrypt.compareSync(req.body.password, doc.password);
            if (passwordsMatch) {
                // req.session.username = req.body.username;
                res.json({
                    success: "found",
                    token: doc.token
                });
            } else {
                res.json({
                    failure: "badPassword"
                });
            }
        }
    });
});

router.post('/options', function(req, res, next){
    Account.update(
        {token: req.body.token}, //which doc to update
        {
            quantity: req.body.quantity, // what to update
            frequency: req.body.frequency.option, // what to update -- include option because ng-option packags it thus
            grind: req.body.grind.option // what to update
        },
        {multi:true}, //update multiple or not
        function(err, numberAffected){  
            console.log(numberAffected);
            if(numberAffected.ok == 1){
                //we succeeded in updating.
                res.json({success: "updated"});
            }else{
                res.json({failure: "failedUpdate"});
            }
        }
    );
});

router.post('/shipping', function(req, res, next){
    // console.log(req.body.fullname);
    Account.update(
        {token: req.body.token}, //which doc to update  
        {
            fullName: req.body.fullName, // what to update
            addressOne: req.body.addressOne,
            addresTwo: req.body.addressTwo,
            usrCity: req.body.usrCity,
            usrState: req.body.usrState,
            usrZip: req.body.usrZip,
            deliveryDate: req.body.deliveryDate
        },
        {multi:true}, //update multiple or not
        function(err, numberAffected){  
            console.log(numberAffected);
            if(numberAffected.ok == 1){
                //we succeeded in updating.
                res.json({success: "updated"});
            }else{
                res.json({failure: "failedUpdate"});
            }
        }
    );
});00

var stripe = require('stripe')(
    "sk_test_Hzydcj3HnTFcI5zCyyzBAeRv"
    );
router.post('/payment', function(req, res, next){
    stripe.charges.create({
        amount: 1000,
        // req.body.stripeAmount,
        currency: 'usd',
        source: req.body.stripeToken, //obtained with stripe
        description: "Charge for " + req.body.stripeEmail
    });
    res.json({message: 'success'});
    console.log('router.post/payment');
});


module.exports = router;


























