import "dotenv/config";
import displayRequests from "./tools/morgan/displayRequests";
import errors from "./middleware/errorHandler";
import { environment, isDebug, port } from "./config";
import express from "express";
import helmet from "helmet";
import MongoDBStore from "connect-mongodb-session";
import morgan from "morgan";
import passport from "passport";
import routes from "./routes";
import saveRequests from "./tools/morgan/saveRequests";
import session from "express-session";

const app = express();
const SessionStore = MongoDBStore(session);

app.use(helmet());
app.use(
  session({
    resave: true,
    saveUninitialized: false,
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

if (isDebug()) {
  app.use(morgan(displayRequests));
} else if (!isDev()) {
  app.use(morgan(saveRequests));
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(routes);
app.use(errors);
app.listen(port, () => console.info("%s server listening on %s", environment, port));
