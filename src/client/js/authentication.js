angular.module('MockServer')
    .run(($rootScope, $location, userService) => {
        $rootScope.$on('$routeChangeStart', (event, next) => {

            // if the token has been passed (saml)
            const search = $location.search();
            if (!userService.isLoggedIn() && search.token) {
                userService.storeSession(search.token, search.user, search.role);
                $location.search('');
            }

            // redirect to login page
            if (!userService.isLoggedIn() || (!userService.isLoggedIn() && !search.token)) {
                $location.path('/login');
            }
        });
    });
