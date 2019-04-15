import { apiRequest, errorHandler } from "../tools/http";
import { saveToken } from "../tools/appToken";
import React from "react";

const Page = ({ loginCB }) => {
  const options = {
    body: {
      password: "admin",
      username: "admin",
    },
    method: "POST",
  };

  return (
    <main className="contents">
      <button
        onClick={() =>
          apiRequest("/api/v1/sessions/login", options)
            .then(res => {
              saveToken(res.token);
              loginCB();
            })
            .catch(errorHandler)
        }
      >
        Login
      </button>
    </main>
  );
};

export default Page;
