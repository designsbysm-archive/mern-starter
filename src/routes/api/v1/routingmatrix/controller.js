import { clearAppToken, getAppToken } from "../../../../tools/genrx-app";

const appKey = "routingmatrix";

const tokenClear = async (req, res, next) => {
  const result = await clearAppToken(appKey);

  if (result.isBoom) {
    return next(result);
  }

  res.sendStatus(200);
};

const tokenGet = async (req, res, next) => {
  const token = await getAppToken(appKey);

  if (token.isBoom) {
    return next(token);
  }

  res.send(token);
};

export { tokenClear, tokenGet };
