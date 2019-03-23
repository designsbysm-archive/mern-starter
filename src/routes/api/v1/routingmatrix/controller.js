import { clearAuthToken, getAuthToken } from "../../../../tools/appAuth";
import Boom from "boom";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";

const appKey = "routingmatrix";

const tokenClear = async (req, res, next) => {
  const result = await clearAuthToken(appKey);

  if (result.isBoom) {
    return next(result);
  }

  res.sendStatus(200);
};

const tokenGet = async (req, res, next) => {
  const isValid = (key, metadata) => {
    if (!metadata) {
      return null;
    }

    const { expires } = metadata;
    const timestamp = Math.floor(Date.now() / 1000);

    if (timestamp < expires) {
      return metadata;
    }

    return null;
  };

  const login = key => {
    const appInfo = dotenv.config({ path: path.resolve(process.cwd(), `.env.${key}`) });

    if (!appInfo.parsed) {
      return Boom.notImplemented(`.env.${key} not found`);
    }

    const { URL, USERNAME, PASSWORD } = appInfo.parsed;

    return fetch(`${URL}/api/v1/sessions/login`, {
      body: JSON.stringify({
        password: PASSWORD,
        username: USERNAME,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(result => result.json())
      .catch(error => {
        return Boom.boomify(error, {
          statusCode: 424,
        });
      });
  };

  const token = await getAuthToken(appKey, isValid, login);

  if (token.isBoom) {
    return next(token);
  }

  res.send(token);
};

export { tokenClear, tokenGet };
