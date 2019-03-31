import { logTo } from "../config";
import winston from "winston";
require("winston-daily-rotate-file");

export default type => {
  if (!logTo.file) {
    return {
      log: () => {},
    };
  }

  return winston.createLogger({
    transports: [
      new winston.transports.DailyRotateFile({
        dirname: `logs/${type}`,
        filename: "%DATE%.log",
      }),
    ],
  });
};
