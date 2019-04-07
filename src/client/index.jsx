import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import App from "./components/app";
// import { saveToken } from "./tools/http/appToken";
import apiRequest from "./tools/http/apiRequest";

// TODO: error notify (via then), error catcher

/* const options = {
  body: {
    password: "admin",
    username: "admin",
  },
  method: "POST",
};

apiRequest("/api/v1/sessions/login", options)
  .then(res => {
    saveToken(res.token);
    console.log(res);
  })
  .catch(err => {}); */

apiRequest("/api/v1/mock/error/text/400", {
  body: {
    message: "Some random error",
  },
  method: "POST",
})
  .then(res => console.log(res))
  .catch(err => console.error(err));

// makeRequest("/api/v1/sessions/login", {
//   body: [
//     "a",
//     "b",
//     "c",
//   ],
// });
// makeRequest("/api/v1/sessions/login", {
//   body: "abc",
// });
// makeRequest("/api/v1/sessions/login", {
//   body: 123,
// });
// makeRequest("/api/v1/sessions/login", {});

// fetch("/api/v1/server", {
//   headers: {
//     Authorization: getAppToken(),
//   },
// })
//   .then(res => res.json())
//   .then(res => console.info(res))
//   .catch(err => console.error(err));

// fetch("/api/v1/sessions/login", {
//   body: JSON.stringify({
//     password: "admin",
//     username: "admin",
//   }),
//   headers: {
//     "Content-Type": "application/json",
//   },
//   method: "POST",
// })
//   .then(res => res.json())
//   .then(res => {
//     localStorage.setItem("appToken", res.token);

//     console.info(res);
//   })
//   .catch(err => console.error(err));

ReactDOM.render(<App />, document.getElementById("root"));
