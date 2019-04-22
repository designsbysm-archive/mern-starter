import { passportJWT, passportLocal, passportSetup } from "../middleware/passport";
import { secretBcrypt } from "../config";
import api from "./api";
import express from "express";
import Model from "../models/User";
import path from "path";

passportSetup();
passportJWT({ Model, secret: secretBcrypt });
passportLocal({ Model, secret: secretBcrypt });
const router = express.Router();

router.use("/api", api);

// static files
router.use("/", express.static(path.join(__dirname, "..", "..", "client")));
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "index.html"));
});

export default router;
