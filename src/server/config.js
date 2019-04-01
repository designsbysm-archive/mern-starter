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
  applicationID: process.env.SAML_APPLICATION_ID || "unknown",
  callbackURL: process.env.SAML_REDIRECT_URL || "unknown",
  certFile: process.env.SAML_CERT || "unknown",
  enabled: process.env.SAML_ENABLED === "true",
  entryPoint: `https://login.microsoftonline.com/${process.env.SAML_TENANT_ID || "unknown"}/saml2`,
};

const secret = process.env.BCRYPT_SECRET;

export { environment, isDebug, isDev, logTo, port, saml, secret };
