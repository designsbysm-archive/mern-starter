import express = require('express');
import log = require('fancy-log');
import morgan = require('morgan');
import passport = require('passport');
import config = require('./config');
import errors = require('./middleware/errors');
import routes = require('./routes');
import { requestLogger } from './tools/requestLogger';

// setup express
const app = express();

app.use(passport.initialize());
app.use(morgan(requestLogger));
app.use(routes);
app.use(errors);

// start the server
const server = app.listen(config.port, () => {
    const { port } = server.address() as IAddressInfo;
    log('%s server listening on %d', config.environment, port);
});

exports = app;
