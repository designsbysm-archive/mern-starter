angular.module('MockServer')
    .controller('AppController', ($scope, $location, userService) => {

        // if the JWT cookie is found, set the auth header & current user
        const token = $scope.$storage['auth-token'];
        if (token) {
            userService.setAuthHeader(token);
            userService.getUser().then(res => {
                $scope.currentUser = res;
            });
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

        $scope.$on('login', (_, user) => {
            $scope.currentUser = user;
        });
    });
