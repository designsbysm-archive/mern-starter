import { apiRequest, errorHandler } from "../tools/http";
import { saveToken } from "../tools/appToken";
import React, { useState } from "react";

//assets
import "../styles/pages/login.scss";

// TODO: grid layout (50% of screen)
const Page = ({ loginCB }) => {
  const [
    username,
    setUsername, 
  ] = useState({});

  const [
    password,
    setPassword, 
  ] = useState({});

  return (
    <main className="contents login">
      <div className="form">
        <div className="group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={event => {
              setUsername(event.target.value);
            }}
          />
        </div>
        <div className="group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={event => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <button
          onClick={() => {
            apiRequest("/api/v1/sessions/login", {
              body: {
                password,
                username,
              },
              method: "POST",
            })
              .then(res => {
                saveToken(res.token);
                loginCB();
              })
              .catch(errorHandler);
          }}
        >
          Login
        </button>
      </div>
    </main>
  );
};

export default Page;
