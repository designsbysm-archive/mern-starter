import fs from "fs";
if (!fs.existsSync("./.env")) {
  console.error("Error: .env config missing, exiting");
  process.exit(1);
}

import "dotenv/config";
if (!process.env.SERVER_ENV || !process.env.SERVER_PORT || !process.env.BCRYPT_SECRET || !process.env.SESSION_SECRET) {
  console.error("Error: .env missing server config, exiting");
  process.exit(1);
}

const environment = process.env.SERVER_ENV;
const isDebug = () => [ "debug" ].includes(environment);
const isDev = () => [
  "debug",
  "development", 
].includes(environment);
const logTo = {
  console: process.env.LOGGING_CONSOLE === "true",
  file: process.env.LOGGING_FILE === "true",
};
const port = process.env.SERVER_PORT;
const saml = process.env.SAML_ENABLED === "true";
const secret = process.env.BCRYPT_SECRET;

export { environment, isDebug, isDev, logTo, port, saml, secret };
