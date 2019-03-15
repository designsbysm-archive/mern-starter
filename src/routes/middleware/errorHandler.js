import auditLog from "../../tools/auditLog";
import Boom from "boom";

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  if (err.isBoom) {
    return res.status(err.output.statusCode)
      .json(err.output.payload);
  }

  console.error(err);

  let boom = Boom.badRequest();
  if (err instanceof Error) {
    boom = Boom.boomify(err, {
      statusCode: 400,
    });
  }

  res.status(boom.output.statusCode)
    .json(boom.output.payload);

  // auditLog("error", {
  //   code: code,
  //   message: result.message,
  //   status: result.status,
  //   timestamp: new Date()
  //     .toISOString(),
  // });
};
