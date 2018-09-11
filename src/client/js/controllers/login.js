angular.module('MockServer')
    .controller('LoginController', ($scope, $location, $window, userService) => {
        $scope.disableLogin = (username, password) => {
            return !username || !password;
        };

        $scope.login = (username, password) => {
            return userService.login(username, password).then(() => {
                $location.path('/');

            }).catch(err => {
                console.error(err); // ts-lint: disable-line

                return err;
            });
        };

        $scope.saml = () => {
            $window.location.href = '/api/v1/sessions/saml';
        };
    });
