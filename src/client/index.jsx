import React from "react";
import ReactDOM from "react-dom";

// components
import { App } from "./components";
import { HomePage } from "./pages";

// assets
import "./styles/index.scss";
import { faAmbulance, faAtom } from "@fortawesome/pro-regular-svg-icons";

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

ReactDOM.render(<App routes={routes} />, document.getElementById("root"));
