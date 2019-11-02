import Boom from "@hapi/boom";
import Logger from "../tools/fileLogger";

const logger = Logger("errors");

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  let boom = {};

  if (err.isBoom) {
    boom = err;
  } else {
    console.error(err);

    if (err instanceof Error) {
      boom = Boom.boomify(err, {
        statusCode: err.statusCode || 400,
      });
    } else if (typeof err === "string") {
      boom = new Boom(err, {
        statusCode: 400,
      });
    } else {
      boom = new Boom(null, {
        statusCode: 499,
      });
      boom.output.payload.error = err;
    }
  }

  const { statusCode, payload } = boom.output;
  const { error, message } = payload;

  logger.log({
    code: statusCode,
    error,
    level: "error",
    message,
    timestamp: new Date(),
  });

  res.status(statusCode)
    .json(payload);
};
