import "dotenv/config";

const environment = process.env.SERVER_ENV;
const port = process.env.SERVER_PORT;
const secret = process.env.BCRYPT_SECRET;
const isDebug = () => [ "debug" ].includes(environment);
const isDev = () => [
  "debug",
  "development", 
].includes(environment);

export { environment, isDebug, isDev, port, secret };
