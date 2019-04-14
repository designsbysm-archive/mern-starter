import { getToken } from "../appToken";

const conditionOptions = (options = {}) => {
  const { body, headers } = options;
  const updates = { ...options };

  // add auth
  const token = getToken();
  if (token !== "undefined") {
    updates.headers = {
      ...updates.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (!body || (headers && headers["Content-Type"])) {
    return updates;
  }

  //json body
  const bodyType = typeof body;
  if (bodyType === "object") {
    updates.body = JSON.stringify(body);
    updates.headers = {
      ...updates.headers,
      "Content-Type": "application/json",
    };
  }

  return updates;
};

// TODO: make .post, .get, or etc functions?

// export default (url, options) => {
export default (url, options) => {
  const requestOptions = conditionOptions(options);

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then(async res => {
        const { ok } = res;
        const text = await res.text();
        let json;

        try {
          json = JSON.parse(text);
        } catch (err) {
          // eat error
        } finally {
          if (ok) {
            resolve(json || text);
          } else {
            // console.error(json || text);
            reject(json || text);
          }
        }
      })
      .catch(err => {
        // console.error(err);
        reject(err);
      });
  });

  //     json: res.json(),
  //     text: res.text(),
  //   };
  // })
  // .then(res => {
  //   console.log(res);

  // return res.json;
  // );
  // .then(res => res.json())
  // .then(res => {
  // console.log(res);
  // })

  // .then(res => console.log(res))
  // .then(res => {
  //   console.log(res);

  //   // if (!res.ok) {
  //   //   return {};
  //   // }
  //   // console.log(res.text(), res.json());

  //   // return res.json();
  //   return res;
  // })
  // .then(res => res.text())
  // .then(res => {
  //   console.log(res);

  //   return res.json;
  // })
  // // .then(res => res.json())
  // .then(res => {
  //   console.log(res);
  // })
  // .then(res => {
  //   localStorage.setItem("appToken", res.token);

  // console.info(res);
  // })
  // .catch(err => console.error(err))

  // console.log(requestOptions);

  // const { body, headers } = options;

  // if (!body || (headers && headers["Content-Type"])) {
  //   return;
  // }

  // const bodyType = typeof body;

  // console.log(body, bodyType);

  // if (bodyType === "object") {
  //   console.log("stringify & add content-type");
  // }

  // console.log(options.body, typeof options.body, options.body.isArray());
};

// export { makeRequest };
