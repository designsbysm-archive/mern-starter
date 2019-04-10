// import "./install";
import apiLogger from "./middleware/apiLogger";
import errors from "./middleware/errorHandler";
import { environment, port, secretSession } from "./config";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import routes from "./routes";
import session from "express-session";
import memoryStore from "memorystore";

const app = express();
const MemoryStore = memoryStore(session);

app.use(helmet());
app.use(apiLogger);
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: secretSession,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: false }));
app.use(routes);
app.use(errors);

app.listen(port, () => console.info("%s server listening on %s", environment, port));
