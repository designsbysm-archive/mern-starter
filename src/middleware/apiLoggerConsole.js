import winston from "winston";

export default (tokens, req, res) => {
  const code = res.statusCode;
  const method = req.method;
  const url = req.originalUrl;
  const formatter = winston.format.printf(info => {
    // eslint-disable-next-line no-shadow
    const { code, method, url } = info;
    const color =
      code >= 500
        ? 31 // red
        : code >= 400
          ? 33 // yellow
          : code >= 300
            ? 36 // cyan
            : code >= 200
              ? 34 // blue
              : 0; // no color

    return `\x1b[${color}m${code}\x1b[0m ${method} ${url}`;
  });

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: formatter,
      }),
    ],
  });

  logger.log({
    code,
    level: "info",
    method,
    url,
  });
};
