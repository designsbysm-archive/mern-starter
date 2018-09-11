angular.module('MockServer')
    .service('userService', ($rootScope, $http, $location, $localStorage) => {
        const Service = function () {
            // start service object
        };

        $rootScope.$storage = $localStorage;

        /** public methods */
        Service.prototype.getUser = function () {
            return Promise.resolve({
                name: $rootScope.$storage['auth-user'],
                role: $rootScope.$storage['auth-role'],
            });
        };

        Service.prototype.isLoggedIn = function () {
            return !!$http.defaults.headers.common.authorization;
        };

        Service.prototype.isRole = function (testRole) {
            const userRole = $rootScope.$storage['auth-role'];

            if (!userRole) {
                return false;
            }

            return userRole === testRole || userRole === 'admin';
        };

        Service.prototype.isUser = function (testUser) {
            const userName = $rootScope.$storage['auth-user'];

            if (!userName) {
                return false;
            }

            return userName === testUser;
        };

        Service.prototype.login = function (username, password) {
            return $http.post('/api/v1/sessions/login', {
                password: password,
                username: username,
            }).then(res => {
                this.storeSession(res.data.token, res.data.user, res.data.role);

                return this.getUser();
            });
        };

        Service.prototype.logout = function () {
            return $http.post('/api/v1/sessions/logout', {}).then(() => {
                delete $rootScope.$storage['auth-role'];
                delete $rootScope.$storage['auth-token'];
                delete $rootScope.$storage['auth-user'];

                $http.defaults.headers.common.authorization = '';

                return false;
            });
        };

        Service.prototype.setAuthHeader = function (token) {
            $http.defaults.headers.common.authorization = `Bearer ${token}`;
        };

        Service.prototype.storeSession = function (token, user, role) {
            $rootScope.$storage['auth-role'] = role;
            $rootScope.$storage['auth-token'] = token;
            $rootScope.$storage['auth-user'] = user;
            this.setAuthHeader(token);

            this.getUser().then(res => {
                $rootScope.$broadcast('login', res);
            }).catch(err => {
                console.error(err); // ts-lint: disable-line
            });
        };

        return new Service;
    });
