import Boom from "boom";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Model from "../models/Option";
import path from "path";
import { updateOption } from "../tools/options";

const clearAppToken = async key => {
  const optionKey = `${key}Auth`;
  const result = await updateOption(optionKey, {});

  if (!result) {
    return Boom.badRequest(`${key}: unable to clear token`);
  }

  return true;
};

const getAppToken = async key => {
  const optionKey = `${key}Auth`;

  const result = await Model.findOne({ key: optionKey })
    .then(res => {
      if (!res || !res.metadata) {
        return null;
      }

      return res.metadata;
    })
    .then(metadata => {
      // verify expiration date
      if (metadata) {
        const { expires } = metadata;
        const timestamp = Math.floor(Date.now() / 1000);

        if (timestamp < expires) {
          return metadata;
        }
      }

      return null;
    })
    .then(async metadata => {
      if (metadata) {
        return metadata;
      }

      const appInfo = dotenv.config({ path: path.resolve(process.cwd(), `.env.${key}`) });

      if (!appInfo.parsed) {
        return Boom.notImplemented(`.env.${key} not found`);
      }

      const { URL, USERNAME, PASSWORD } = appInfo.parsed;

      const loginResult = await fetch(`${URL}/api/v1/sessions/login`, {
        body: JSON.stringify({
          password: PASSWORD,
          username: USERNAME,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then(res => res.json())
        .catch(err => {
          return Boom.boomify(err, {
            statusCode: 424,
          });
        });

      return updateOption(optionKey, loginResult)
        .then(() => {
          return loginResult;
        });
    });

  if (!result) {
    return Boom.failedDependency(`${key}: unable to get token`);
  }

  return result;
};

export { clearAppToken, getAppToken };
