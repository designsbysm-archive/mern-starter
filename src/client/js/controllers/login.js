angular.module('MockServer')
    .controller('LoginController', ($scope, $location, userService) => {
        $scope.disableLogin = (username, password) => {
            return !username || !password;
        };

        $scope.login = (username, password) => {
            return userService.login(username, password).then(res => {
                $scope.$emit('login', res.data);

                userService.getUser().then(getRes => {
                    if (getRes.data.role === 'tech') {
                        $location.path('/search');
                    } else {
                        $location.path('/');
                    }

                    return getRes;
                });

            }).catch(err => {
                console.error(err);

                return err;
            });
        };

        $scope.sso = () => {
            window.location.href = '/api/v1/saml/login';
        };
    });
