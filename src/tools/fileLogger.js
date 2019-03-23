import winston from "winston";
require("winston-daily-rotate-file");

export default type => {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.DailyRotateFile({
        dirname: `logs/${type}`,
        filename: "%DATE%.log",
      }),
    ],
  });

  return logger;
};
