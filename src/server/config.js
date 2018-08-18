const dotenv = require('dotenv');
const ip = require('ip');

// load .env variables
dotenv.config();

module.exports = {
    environment: process.env.SERVER_ENV,
    ip: ip.address(),
    port: process.env.SERVER_PORT,
    secret: process.env.BCRYPT_SECRET,
};
