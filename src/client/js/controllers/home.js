angular.module('MockServer')
    .controller('HomeController', ($scope, $http) => {
        $scope.getVehicles = () => {
            return $http.get('/api/v1/vehicles').then(res => {
                console.log(res); // ts-lint: disable-line
            });
        };
    });
