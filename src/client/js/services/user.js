angular.module('MockServer')
    .service('userService', ($rootScope, $http, $location, $localStorage) => {
        const Service = function () {
            // start service object
        };

        $rootScope.$storage = $localStorage;

        /** public methods */
        Service.prototype.getUser = function () {
            if (!this.isLoggedIn()) {
                return Promise.resolve({});
            }

            return $http.get('/api/v1/users').then(res => {
                return res;
            }).catch(() => {
                this.logout();
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
                const expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 7);

                $rootScope.$storage['auth-token'] = res.data.token;
                this.setAuthHeader(res.data.token);

                return this.getUser().then(getRes => {
                    $rootScope.$storage['auth-role'] = getRes.data.role;

                    return getRes;
                });
            });
        };

        Service.prototype.logout = function () {
            return $http.post('/api/v1/sessions/logout', {}).then(() => {
                delete $rootScope.$storage['auth-role'];
                delete $rootScope.$storage['auth-token'];

                $http.defaults.headers.common.authorization = '';

                return false;
            });
        };

        Service.prototype.setAuthHeader = function (token) {
            $http.defaults.headers.common.authorization = `Bearer ${token}`;
        };

        return new Service;
    });
