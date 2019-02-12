import "dotenv/config";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { environment, port } from "./config";
import errors from "./middleware/errors";
import routes from "./routes";
import morganAPI from "./tools/morganAPI";
import morganDev from "./tools/morganDev";
import MongoDBStore from "connect-mongodb-session";
const SessionStore = MongoDBStore(session);

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
app.listen(port, () => console.info("%s server listening on %s", environment, port));
