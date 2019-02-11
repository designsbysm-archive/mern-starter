angular.module("MockServer")
  .controller("AppController", ($scope, $location, userService) => {
    $scope.user = userService.getUser();
    $scope.$on("login", () => {
      $scope.user = userService.getUser();
    });

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
      $location.path("/login");
    };
  });
