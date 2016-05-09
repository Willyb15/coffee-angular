var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies']);
var apiUrl = 'http://localhost:3000';

coffeeApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'coffeeController'
    }).when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController'
    }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController'
    }).when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'logoutController'
    }).when('/options', {
        templateUrl: 'views/options.html',
        controller: 'optionsController'
    }).when('/shipping', {
        templateUrl: 'views/shipping.html',
        controller: 'shippingController'
    }).when('/payment', {
        templateUrl: 'views/payment.html',
        controller: 'paymentController'
    }).when('/receipt', {
        templateUrl: 'views/receipt.html',
        controller: 'receiptController'
    }).when('/story', {
        templateUrl: 'views/story.html',
        controller: 'coffeeController'
    }).otherwise({
        redirectTo: '/'
    });
});


coffeeApp.controller('coffeeController', function($scope) {
    console.log('this is the coffee "MAIN" controller');
});

coffeeApp.controller('registerController', function($scope, $http, $location, $cookies) {
    //console.log($location.search());
    console.log('this is the registerController');
    //the location service has access to the query string. 
    //Pull out the property and put the value in the errorMessage
    if ($location.search().failure == "badToken") {
        $scope.errorMessage = "You must login to access the requested page.";
    }


    $scope.registerForm = function() {
        if ($scope.password != $scope.password2) {
            $scope.errorMessage = "Your passwords do not match.";
        } else {
            $http({
                method: 'POST',
                url: apiUrl + '/register',
                data: {
                    username: $scope.username,
                    password: $scope.password,
                    password2: $scope.password2,
                    email: $scope.email
                }
            }).then(function successCallback(response) {
                if (response.data.failure == 'passwordMatch') {
                    $scope.errorMessage = 'The passwords do not match.';
                } else if (response.data.success == 'added') {
                    // store the token and username inside cookies
                    // potential security issue here
                    $cookies.put('token', response.data.token);
                    $cookies.put('username', $scope.username);
                    //redirect to options page
                    $location.path('/options');
                }
            }, function errorCallback(status) {
                console.log(status);
            });
        }
    };
});


coffeeApp.controller('loginController', function($scope, $http, $location, $cookies) {

    if (($location.path() == '/login')) {
        if ($cookies.get('token')) {
            //you should not be on the login page because you are logged in.
            //I'm sending you to the options page. Don't try and come back.
            $location.path('/options');
        }
    }

    $scope.loginForm = function() {
        $http({
            method: 'POST',
            url: apiUrl + '/login',
            data: {
                username: $scope.username,
                password: $scope.password
            }
        }).then(function successCallback(response) {
            if (response.data.failure == 'noMatch') {
                $scope.errorMessage = 'The password entered does not match our records.';
            } else if (response.data.failure == 'noUser') {
                $scope.errorMessage = 'The username entered was not found.';
            } else if (response.data.success == 'found') {
                // store the token and username inside cookies
                // potential security issue here
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);
                $scope.loggedIn = true;
                //redirect to options page
                $location.path('/options');
            }
        }, function errorCallback(status) {
            console.log(status);
        });
    };
});

coffeeApp.controller('logoutController', function($scope, $cookies) {
    $cookies.remove("token");
    $cookies.remove("username");
});

coffeeApp.controller('optionsController', function($scope, $http, $location, $cookies) {

    $http.get(apiUrl + '/getUserData?token=' + $cookies.get('token'), {}).then(function successCallback(response) {
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

    $scope.frequencies = [{
        option: "Weekly"
    }, {
        option: "Every other week"
    }, {
        option: "Monthly"
    }];

    $scope.grinds = [{
        option: "Espresso"
    }, {
        option: "Aeropress"
    }, {
        option: "Drip"
    }, {
        option: "Chemex/Clever"
    }, {
        option: "French Press"
    }];

    $scope.optionsForm = function(formID) {

        //Get the appropriate values based on what the user selected
        //Set them up for our AJAX call
        if (formID == 1) {
            var selectedGrind = $scope.grindTypeOne;
            var selectedQuantity = 2;
            var selectedFrequency = $scope.frequencyOne;
        } else if (formID == 2) {
            var selectedGrind = $scope.grindTypeTwo;
            var selectedQuantity = 8;
            var selectedFrequency = $scope.frequencyTwo;
        } else if (formID == 3) {
            var selectedGrind = $scope.grindTypeThree;
            var selectedQuantity = $scope.quantity;
            var selectedFrequency = $scope.frequencyThree;
        }
        $http.post(apiUrl + '/options', {
            quantity: selectedQuantity,
            grind: selectedGrind,
            frequency: selectedFrequency,
            token: $cookies.get('token')
        }).then(function successCallback(response) {
            if (response.data.success == 'updated') {
                $location.path('/shipping');
            } else {
                $scope.errorMessage = 'Please contact support.';
            }
        }, function errorCallback(response) {
            console.log("ERROR.");
        });
    };
});


coffeeApp.controller('shippingController', function($scope, $http, $location, $cookies) {

    $http.get(apiUrl + '/getUserData?token=' + $cookies.get('token'), {}).then(function successCallback(response) {
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

    $scope.shippingForm = function() {

        $http.post(apiUrl + '/shipping', {
            fullName: $scope.fullName,
            addressOne: $scope.addressOne,
            addressTwo: $scope.addressTwo,
            usrCity: $scope.usrCity,
            usrState: $scope.usrState,
            usrZip: $scope.usrZip,
            deliveryDate: $scope.deliveryDate,
            token: $cookies.get('token')

        }).then(function successCallback(response) {
            console.log(response.data.success);
            console.log($scope.fullName);
            console.log($scope.addressOne);
            console.log($scope.deliveryDate);
            if (response.data.success == 'updated') {
                $location.path('/payment');
            }
        }, function errorCallback(response) {
            console.log("ERROR.");
        });

    };
});


coffeeApp.controller('paymentController', function($scope, $http, $location, $cookies) {
    console.log('this is paymentController');
    $http.get(apiUrl + '/getUserData?token=' + $cookies.get('token'), {}).then(function successCallback(response) {
        console.log(response);
        if (response.data.failure == 'badToken') {
            //User needs to log in
            $location.path('/register?failure=badToken');
        } else {
            $scope.userOptions = response.data;
            // console.log($scope.userOptions);
            // console.log($scope.userOptions.quantity);
            $scope.total = ("$" + $scope.userOptions.quantity * 20);
            // console.log($scope.total);
        }
    }, function errorCallback(response) {
        console.log(response.status);
    });


    $scope.checkoutForm = function() {
        console.log('checkoutForm');
        $http({
            method: 'GET',
            url: apiUrl + '/payment',
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
                console.log('success');
                //redirect to receipt page
                $location.path('/receipt');
            }
        }, function errorCallback(status) {
            console.log(status);
        });
    };
});


coffeeApp.controller('receiptController', function($scope) {
    console.log('this is the receipt controller.');
});