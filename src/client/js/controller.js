angular.module('MockServer')
    .controller('AppController', ($scope, $location, userService) => {
        $scope.user = userService.getUser();
        $scope.$on('login', () => {
            $scope.user = userService.getUser();
        });

        // if the JWT cookie is found, set the auth header & current user
        const token = $scope.$storage['auth-token'];
        if (token) {
            userService.setAuthHeader(token);
        }

        $scope.isLoggedIn = () => {
            return userService.isLoggedIn();
        };

        $scope.isUserRole = role => {
            return userService.isRole(role);
        };

        $scope.isUserName = name => {
            return userService.isUser(name);
        };

        $scope.logout = () => {
            userService.logout();
            $location.path('/login');
        };
    });
