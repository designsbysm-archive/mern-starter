import Boom from "boom";
import Logger from "../tools/fileLogger";
const logger = Logger("errors");

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  let boom = {};

  if (err.isBoom) {
    boom = err;
  } else {
    console.error(err);

    boom = Boom.badRequest();
    if (err instanceof Error) {
      boom = Boom.boomify(err, {
        statusCode: 400,
      });
    }
  }

  const { statusCode, payload } = boom.output;
  const { message } = payload;

  logger.log({
    code: statusCode,
    level: "error",
    message,
    timestamp: new Date(),
  });

  res.status(statusCode)
    .json(payload);
};
