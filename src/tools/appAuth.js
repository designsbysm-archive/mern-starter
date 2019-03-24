import Boom from "boom";
import Model from "../models/Option";
import { updateOption } from "./options";

const clearAuthToken = async key => {
  const optionKey = `${key}Auth`;
  const result = await updateOption(optionKey, {});

  if (!result) {
    return Boom.badRequest(`${key}: unable to clear token`);
  }

  return true;
};

const epochValidCheck = metadata => {
  const { expires } = metadata;
  const timestamp = Math.floor(Date.now() / 1000);

  if (timestamp < expires) {
    return metadata;
  }

  return null;
};

const errorCatcher = error =>
  Boom.boomify(error, {
    statusCode: 424,
  });

const getAuthToken = async (key, expirationFN, loginFN) => {
  const optionKey = `${key}Auth`;

  const result = await Model.findOne({ key: optionKey })
    .then(res => {
      if (!res || !res.metadata) {
        return null;
      }

      return res.metadata;
    })
    .then(metadata => {
      if (!metadata) {
        return null;
      }

      return expirationFN(metadata);
    })
    .then(metadata => {
      if (metadata) {
        return metadata;
      }

      return loginFN();
    })
    .then(async metadata => {
      if (metadata.isBoom) {
        return metadata;
      }

      await updateOption(optionKey, metadata);

      return metadata;
    });

  if (!result) {
    return Boom.failedDependency(`${key}: unable to get token`);
  }

  return result;
};

export { clearAuthToken, epochValidCheck, errorCatcher, getAuthToken };
