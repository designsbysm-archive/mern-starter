angular.module('MockServer')
    .controller('HomeController', ($scope, $http) => {
        $scope.getError = () => {
            return $http.get('/api/v1/people').then(res => {
                console.log(res); // tslint:disable-line
            });
        };

        $scope.getVehicles = () => {
            return $http.get('/api/v1/vehicles').then(res => {
                console.log(res); // tslint:disable-line
            });
        };
    });
