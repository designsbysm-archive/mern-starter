import fs from "fs";
if (!fs.existsSync("./.env")) {
  console.error("Error: .env config missing, exiting");
  process.exit(1);
}

// import "./install";
import "dotenv/config";
import apiConsole from "./middleware/apiLoggerConsole";
import apiLogger from "./middleware/apiLoggerFile";
import errors from "./middleware/errorHandler";
import { environment, isDebug, port } from "./config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import routes from "./routes";
import session from "express-session";
import memoryStore from "memorystore";

const app = express();
const MemoryStore = memoryStore(session);

if (!isDebug()) {
  app.use(morgan(apiConsole));
}
app.use(morgan(apiLogger));
app.use(helmet());
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
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
