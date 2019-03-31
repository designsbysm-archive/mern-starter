import { logTo } from "../config";
import FileLogger from "../tools/fileLogger";
import onFinished from "on-finished";
import winston from "winston";

const logToConsole = ({ code, method, url }) => {
  if (!logTo.console) {
    return;
  }

  // eslint-disable-next-line no-shadow
  const formatter = winston.format.printf(({ code, method, url }) => {
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

const logToFile = ({ code, method, url, username }) => {
  const logger = FileLogger("api");

  logger.log({
    code,
    level: "info",
    method,
    timestamp: new Date(),
    url,
    username,
  });
};

export default (req, res, next) => {
  if (!req.originalUrl.startsWith("/api/")) {
    return next();
  }

  onFinished(res, () => {
    const info = {
      code: res.statusCode,
      method: req.method,
      url: req.originalUrl,
      username: req.user ? req.user.username : "unknown",
    };

    logToConsole(info);
    logToFile(info);
  });

  next();
};
