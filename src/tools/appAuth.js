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

const getAuthToken = async (key, expirationFN, loginFN) => {
  const optionKey = `${key}Auth`;

  const result = await Model.findOne({ key: optionKey })
    .then(res => {
      if (!res || !res.metadata) {
        return null;
      }

      return res.metadata;
    })
    .then(metadata => expirationFN(key, metadata))
    .then(metadata => {
      if (metadata) {
        return metadata;
      }

      return loginFN(key, metadata);
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

export { clearAuthToken, getAuthToken };
