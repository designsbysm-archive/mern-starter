import React from "react";
import ReactDOM from "react-dom";

// components
import { App } from "./components";
import { HomePage } from "./pages";

// assets
import packageJson from "../../package.json";

const routes = {
  admin: [],
  main: [
    {
      component: HomePage,
      hidden: true,
      title: "Home",
      url: "/",
    },
  ],
};

ReactDOM.render(
  <App routes={routes} title={packageJson.app.title} version={packageJson.version} />,
  document.getElementById("root"),
);
