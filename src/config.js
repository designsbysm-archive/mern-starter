import "dotenv/config";

const environment = process.env.SERVER_ENV;
const port = process.env.SERVER_PORT;
const secret = process.env.BCRYPT_SECRET;

export { environment, port, secret };
