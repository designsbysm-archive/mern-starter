const dotenv = require("dotenv");

// load .env variables
dotenv.config();

function isDevelopment() {
  return process.env.SERVER_ENV === "debug" || process.env.SERVER_ENV === "development";
}

function isProduction() {
  return process.env.SERVER_ENV !== "debug" && process.env.SERVER_ENV !== "development";
}

exports.isDev = isDevelopment;
exports.isProd = isProduction;
