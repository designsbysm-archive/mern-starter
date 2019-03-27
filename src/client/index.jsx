import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import App from "./App";

fetch("/api/v1/server", {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODUxODE4NDQsImlkIjoiNWM2MWQxNjgwODllYjI3MmY1Zjk3NTI3IiwidXBkYXRlZCI6IjIwMTktMDMtMjFUMDY6MzA6NTYuNjY1WiIsImlhdCI6MTU1MzY0NTg0NH0.O5PXhUtd8eLb8BCgxR6z7GcuDY5x02oYUZ0_n780CPw",
  },
})
  .then(res => res.json())
  .then(res => console.info(res))
  .catch(err => console.error(err));

ReactDOM.render(<App />, document.getElementById("root"));
