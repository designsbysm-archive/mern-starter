import React from "react";
import ReactDOM from "react-dom";

// components
import { App } from "./components";
import { HomePage } from "./pages";

// assets
import "./styles/index.scss";
import { faAmbulance, faAtom } from "@fortawesome/pro-regular-svg-icons";

const routes = {
  admin: [
    {
      component: HomePage,
      icon: faAmbulance,
      // role: "",
      title: "Page Four",
      url: "/page4",
    },
  ],
  main: [
    {
      component: HomePage,
      icon: faAmbulance,
      // role: "",
      title: "Page One",
      url: "/page1",
    },
    {
      component: HomePage,
      icon: faAtom,
      // role: "",
      title: "Page Two",
      url: "/page2",
    },
    {
      component: HomePage,
      title: "Page Three",
      url: "/page3",
    },
    {
      children: [
        {
          component: HomePage,
          title: "Test One",
          url: "/one",
        },
        {
          component: HomePage,
          title: "Test Two",
          url: "/two",
        },
        {
          component: HomePage,
          title: "Test Three",
          url: "/three",
        },
      ],
      component: HomePage,
      hidden: false,
      icon: "",
      // role: "",
      title: "Test",
      url: "/test",
    },
    {
      component: HomePage,
      hidden: true,
      title: "Home",
      url: "/",
    },
  ],
};

ReactDOM.render(<App routes={routes} />, document.getElementById("root"));
