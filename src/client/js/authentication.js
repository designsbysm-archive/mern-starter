angular.module("MockServer")
  .run(($rootScope, $localStorage, $location, $route, config, userService) => {
  // get the token from saml or cookie
    const token = $location.search().token || $localStorage["auth-token"];
    userService.storeSession(token);
    $location.search("");

    $rootScope.$on("$routeChangeStart", async (event, next) => {
    // if token found, clear parameters
      if ($location.search().token) {
        $location.search("");
      }

      // if we haven't loaded yet, stop and load
      if (!config.loaded) {
        event.preventDefault();

        return config.load(config)
          .then(() => {
            $route.reload();
          });
      } else if (!config.user) {
        await config.load(config);
      }

      // if not logged in, redirect to login page
      if (!userService.isLoggedIn() && (next.$$route && next.$$route.originalPath !== "/login")) {
        event.preventDefault();
        $location.path("/login");

      // if logged in, redirect to home page
      } else if (userService.isLoggedIn() && (next.$$route && next.$$route.originalPath === "/login")) {
        event.preventDefault();
        $location.path("/");
      }
    });
  });
