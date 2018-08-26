angular.module('MockServer')
    .run(($rootScope, $location, userService) => {
        $rootScope.$on('$routeChangeStart', (event, next) => {
            // redirect to login page
            if (!userService.isLoggedIn()) {
                $location.path('/login');
            }

            // if only search redirect
            userService.getUser().then(res => {
                if (!res) {
                    return;
                }
            });
        });
    });
