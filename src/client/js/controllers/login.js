angular.module('MockServer')
    .controller('LoginController', ($scope, $location, $window, userService) => {
        $scope.disableLogin = (username, password) => {
            return !username || !password;
        };

        $scope.login = (username, password) => {
            return userService.login(username, password).then(() => {
                $location.path('/');

            }).catch(err => {
                // notificationService.create('warning', null, 'Unable to login, please try again.');
                console.error(err); // tslint:disable-line

                return err;
            });
        };

        $scope.saml = () => {
            $window.location.href = '/api/v1/sessions/saml';
        };
    });
