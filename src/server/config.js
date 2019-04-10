import "dotenv/config";
import { missingConfig } from "./tools/messages";
import fs from "fs";

if (
  !fs.existsSync("./.env") ||
  !process.env.SERVER_ENV ||
  !process.env.SERVER_PORT ||
  !process.env.BCRYPT_SECRET ||
  !process.env.SESSION_SECRET
) {
  console.error(missingConfig);
  process.exit(1);
}

const environment = process.env.SERVER_ENV;

const isDebug = () => [ "debug" ].includes(environment);

const isDev = () => [
  "debug",
  "development", 
].includes(environment);

const isProd = () => [ "production" ].includes(environment);

const logTo = {
  console: process.env.LOGGING_CONSOLE === "true",
  file: process.env.LOGGING_FILE === "true",
};

const port = process.env.SERVER_PORT;

const saml = process.env.SAML_ENABLED === "true";

const secretBcrypt = process.env.BCRYPT_SECRET;

const secretSession = process.env.SESSION_SECRET;

export { environment, isDebug, isDev, isProd, logTo, port, saml, secretBcrypt, secretSession };
