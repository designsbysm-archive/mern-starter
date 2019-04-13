import { apiRequest, errorHandler } from "../tools/http";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import React, { useEffect, useState } from "react";

// components
import { Footer, Header } from "./index";
import { LoginPage } from "../pages";

// assets
import "../styles/app.scss";
import packageJson from "../../../package.json";

const getRoutes = (config, base, routes) =>
  routes.map(route => {
    const path = base + route.url;
    const children = route.children || [];
    if (children.length > 0) {
      return getRoutes(config, path, children);
    }

    const Page = route.component;
    // console.log(config);
    const { user } = config;
    const component = props =>
      user ? (
        <Page {...props} route={route} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      );

    return <Route exact key={path} path={path} component={component} />;
  });

const App = ({ routes }) => {
  const [
    config,
    setConfig, 
  ] = useState({});

  const [
    isAuthenticated,
    setAuthenticated, 
  ] = useState(false);
  useEffect(() => {
    apiRequest("/api/v1/server", {})
      .then(res => {
        // console.log(res);
        const { user } = res;
        setConfig(res);

        if (!isAuthenticated && user) {
          setAuthenticated(true);
          // console.log("redirect");
        }
      })
      .catch(errorHandler);
  }, [
    isAuthenticated,
    setConfig, 
  ]);

  // console.log(isAuthenticated, config);

  return (
    <Router>
      <>
        <Header config={config} logoutCB={() => setAuthenticated(false)} routes={routes} />
        <Switch>
          {getRoutes(config, "", routes.admin)}
          {getRoutes(config, "", routes.main)}
          <Route
            path="/login"
            component={props => (
              <LoginPage
                loginCB={() => {
                  const { from } = props.location.state || { from: { pathname: "/" } };

                  setAuthenticated(true);
                  props.history.push(from.pathname || "/");
                }}
              />
            )}
          />
          <Route
            render={props => {
              const isHome = props.location.pathname === "/";

              if (!isHome) {
                return <Redirect to="/" />;
              }
            }}
          />
        </Switch>
        <Footer title={`[${packageJson.app.initials}] ${packageJson.app.title}`} version={packageJson.version} />
      </>
    </Router>
  );
};

export default App;
