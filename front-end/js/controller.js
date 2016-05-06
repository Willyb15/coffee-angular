var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies']);
// var apiUrl = 'http://localhost:3020/';
coffeeApp.controller('coffeeController', function($scope, $http, $location, $cookies) {

    var apiPath = 'http://localhost:3000/';

    $http.get(apiPath + 'getUserData?token=' + $cookies.get('token'), {}).then(function successCallback(response) {
        console.log(response);
        if (response.data.failure == 'badToken') {
            //User needs to log in
            $location.path('/register');
        } else {
            $scope.userOptions = response.data;
        }
    }, function errorCallback(response) {
        console.log(response.status);
    });

    $scope.loginForm = function() {
        $http.post('http://localhost:3000/login', {
            username: $scope.username,
            password: $scope.password
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data.success == 'found') {
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);
                $location.path('/options');
            } else if (response.data.failure == 'noUser') {
                $scope.errorMessage = 'No such user in th db';
            } else if (response.data.failure == 'badPassword') {
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);
                $scope.errorMessage = 'Bad password for this user.';
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
                $location.path('/options');
            }
        }, function errorCallback(response) {
            console.log(response.status);
        });
    };

    $scope.optionsForm = function(){
        //Get the appropriate values based on what the user selected
        //Set them up for our AJAX call
            var selectedGrind = $scope.grindTypeOne;
            var selectedQuantity = 2;
            var selectedFrequency = 'weekly';
            console.log("submit");
        $http.post(apiPath + 'options', {
            // quantity: selectedQuantity,
            // grind: selectedGrind,
            // frequency: selectedFrequency,
            token: $cookies.get('token')
        }).then(function successCallback(response){
            if(response.data.success == 'updated'){
                $location.path('/shipping');
            }
        }, function errorCallback(response){
            console.log("ERROR.");
        });
    };
});


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