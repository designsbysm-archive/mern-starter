import React from "react";
import ReactDOM from "react-dom";

// components
import { App } from "./components";
import { HomePage } from "./pages";

// assets
import "./styles/index.scss";

const routes = {
  admin: [],
  main: [
    {
      component: HomePage,
      icon: "",
      // role: "",
      title: "Page One",
      url: "/page1",
    },
    {
      component: HomePage,
      icon: "",
      // role: "",
      title: "Page Two",
      url: "/page2",
    },
    {
      component: HomePage,
      icon: "",
      // role: "",
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
