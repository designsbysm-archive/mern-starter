angular.module('MockServer')
    .config(($locationProvider, $routeProvider) => {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: '/views/home.html',
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: '/views/login.html',
            })
            .otherwise({
                redirectTo: '/',
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
        });
    });
