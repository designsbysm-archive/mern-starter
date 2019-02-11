const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");
const config = require("./config");
const errors = require("./middleware/errors");
const routes = require("./routes");
const { morganAPI } = require("./tools/morganAPI");
const { morganDev } = require("./tools/morganDev");
const MongoDBStore = require("connect-mongodb-session");
const SessionStore = MongoDBStore(session);

// load .env variables
dotenv.config();

// setup express middleware
const app = express();
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new SessionStore({
      collection: "sessions",
      uri: process.env.MONGO_CONNECTION,
    }),
    unset: "destroy",
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(morganAPI));
app.use(morgan(morganDev));
app.use(routes);
app.use(errors);

// start the server
app.listen(config.port, () => {
  console.info("%s server listening on %d", config.environment, config.port);
});

module.exports = app;
