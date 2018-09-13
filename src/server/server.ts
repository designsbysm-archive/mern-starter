import MongoDBStore = require('connect-mongodb-session');
import dotenv = require('dotenv');
import express = require('express');
import session = require('express-session');
import log = require('fancy-log');
import morgan = require('morgan');
import passport = require('passport');
import config = require('./config');
import errors = require('./middleware/errors');
import routes = require('./routes');
import { morganAPI } from './tools/morganAPI';
import { morganDev } from './tools/morganDev';
import { IAddressInfo } from './types/express';

const SessionStore = MongoDBStore(session);

// load .env variables
dotenv.config();

// setup express middleware
const app = express();
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new SessionStore({
        collection: 'sessions',
        uri: process.env.MONGO_CONNECTION,
    }),
    unset: 'destroy',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(morganAPI));
app.use(morgan(morganDev));
app.use(routes);
app.use(errors);

// start the server
const server = app.listen(config.port, () => {
    const { port } = server.address() as IAddressInfo;
    log('%s server listening on %d', config.environment, port);
});

exports = app;
