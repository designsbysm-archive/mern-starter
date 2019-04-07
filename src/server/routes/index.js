import { passportJWT, passportLocal, passportSaml, passportSetup } from "../middleware/passport";
import { secret } from "../config";
import api from "./api";
import express from "express";
import Model from "../models/User";
import path from "path";

passportSetup();
passportJWT({ Model, secret });
passportLocal({ Model, secret });
passportSaml({ Model, secret });
const router = express.Router();

router.use("/api", api);

// static files
router.use("/", express.static(path.join(__dirname, "..", "..", "client")));
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "index.html"));
});

export default router;
