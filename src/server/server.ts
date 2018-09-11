import cookieParser = require('cookie-parser');
import dotenv = require('dotenv');
import express = require('express');
import session = require('express-session');
import log = require('fancy-log');
import morgan = require('morgan');
import passport = require('passport');
import config = require('./config');
import errors = require('./middleware/errors');
import routes = require('./routes');
import { requestLogger } from './tools/requestLogger';

// load .env variables
dotenv.config();

// setup express
const app = express();

// middleware
app.use(cookieParser());
app.use(session(
    {
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
    }));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(requestLogger));
app.use(routes);
app.use(errors);

// start the server
const server = app.listen(config.port, () => {
    const { port } = server.address() as IAddressInfo;
    log('%s server listening on %d', config.environment, port);
});

exports = app;
