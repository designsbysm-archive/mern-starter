import "dotenv/config";

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
const saml = {
  enabled: process.env.SAML_ENABLED === "true",
};
const secret = process.env.BCRYPT_SECRET;

export { environment, isDebug, isDev, logTo, port, saml, secret };
