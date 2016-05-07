var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies']);
// var apiUrl = 'http://localhost:3020/';
coffeeApp.controller('coffeeController', function($scope, $http, $location, $cookies) {

    $scope.loginForm = function() {
        $http.post('http://localhost:3000/login', {
            username: $scope.username,
            password: $scope.password
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data.success == 'found') {
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);
                $scope.loggedIn = true;
                $location.path('/options');
            } else if (response.data.failure == 'noUser') {
                $scope.errorMessage = 'The username entered was not found';
            } else if (response.data.failure == 'badPassword') {
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);
                $scope.errorMessage = 'Incorrect password.';
            }
        }, function errorCallback(response) {

        });
    };

    $scope.registerForm = function() {

        console.log($scope.username);
        $http.post('http://localhost:3000/register', {
            username: $scope.username,
            password: $scope.password,
            password2: $scope.password2,
            email: $scope.email
        }).then(function successCallback(response) {
            console.log(response.data.failure);
            if (response.data.failure == 'passwordMatch') {
                $scope.errorMessage = 'Your passwords must match.';
            } else if (response.data.success == 'added') {
                // store the token and username inside the cookies
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);
                $location.path('/options');
            }
        }, function errorCallback(response) {
            console.log(response.status);
        });
    };

    var apiPath = 'http://localhost:3000';

    $http.get(apiPath + '/getUserData?token=' + $cookies.get('token'), {}).then(function successCallback(response) {
        console.log(response);
        if (response.data.failure == 'badToken') {
            //User needs to log in
            $location.path('/register?failure=badToken');
        } else {
            $scope.userOptions = response.data;
        }
    }, function errorCallback(response) {
        console.log(response.status);
    });


    $scope.optionsForm = function(formID) {
        //Get the appropriate values based on what the user selected
        //Set them up for our AJAX call
        if (formID == 1) {
            var selectedGrind = $scope.grindTypeOne;
            var selectedQuantity = 2;
            var selectedFrequency = 'weekly';
        } else if (formID == 2) {
            var selectedGrind = $scope.grindTypeTwo;
            var selectedQuantity = 8;
            var selectedFrequency = 'monthly';
        } else if (formID == 3) {
            var selectedGrind = $scope.grindTypeThree;
            var selectedQuantity = $scope.quantity;
            var selectedFrequency = $scope.frequency;
        }
        $http.post(apiPath + '/options', {
            quantity: selectedQuantity,
            grind: selectedGrind,
            frequency: selectedFrequency,
            token: $cookies.get('token')
        }).then(function successCallback(response) {
            if (response.data.success == 'updated') {
                $location.path('/shipping');
            }
        }, function errorCallback(response) {
            console.log("ERROR.");
        });
    };


    $scope.deliveryForm = function() {

        $http.post(apiPath + '/shipping', {
            fullname: $scope.fullName,
            addressOne: $scope.addressOne,
            addressTwo: $scope.addressTwo,
            usrCity: $scope.usrCity,
            usrState: $scope.usrState,
            usrZip: $scope.usrZip,
            deliveryDate: $scope.deliveryDate,
            token: $cookies.get('token')
        }).then(function successCallback(response) {
            console.log(response.data.success);
            if (response.data.success == 'updated') {
                $location.path('/payment');
            }
        }, function errorCallback(response) {
            console.log("ERROR.");
        });
    };

    $scope.checkoutForm = function() {
        $http({
            method: 'POST',
            url: apiUrl + '/checkout',
            data: {
                token: $cookies.get('token'),
                frequency: $cookies.get('frequency'),
                quantity: $cookies.get('quantity'),
                grindType: $cookies.get('grindType'),
                fullname: $cookies.get('fullname'),
                addressOne: $cookies.get('addressOne'),
                addressTwo: $cookies.get('addressTwo'),
                city: $cookies.get('city'),
                state: $cookies.get('state'),
                zip: $cookies.get('zip'),
                deliveryDate: $cookies.get('deliveryDate')
            }
        }).then(function successCallback(response) {
            if (response.data.failure == 'noToken') {
                // invalid token, so redirect to login page
                $location.path('/login');
            } else if (success = 'tokenMatch') {
                //redirect to receipt page
                $location.path('/receipt');
            }
        }, function errorCallback(status) {
            console.log(status);
        });
    };
});



// TestKey sk_test_Hzydcj3HnTFcI5zCyyzBAeRv
// Test Publishable pk_test_P02o5AItX3A2yOdCs9oBnQXY 



coffeeApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: "views/main.html",
        controller: 'coffeeController'
    }).when('/register', {
        templateUrl: "views/register.html",
        controller: 'coffeeController'
    }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'coffeeController'
    }).when('/options', {
        templateUrl: "views/options.html",
        controller: 'coffeeController'
    }).when('/shipping', {
        templateUrl: "views/shipping.html",
        controller: 'coffeeController'
    }).when('/payment', {
        templateUrl: "views/payment.html",
        controller: 'coffeeController'
    });

});