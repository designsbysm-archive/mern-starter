angular.module("MockServer")
  .config($provide => {
    $provide.decorator("$exceptionHandler", ($delegate, $injector) => {
      return (exception, cause) => {
        const userService = $injector.get("userService");

        if (userService.isLoggedIn() || (!userService.isLoggedIn() && exception.message !== "Unauthorized")) {
          $delegate(exception, cause);
        }
      };
    });
  });
