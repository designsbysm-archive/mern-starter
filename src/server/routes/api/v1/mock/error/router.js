import { boom, json, text } from "./controller";
import express from "express";
import validateJWT from "../../../../../middleware/validate/jwt";

const router = express.Router({ mergeParams: true });

router.route("/json/:code")
  .post(validateJWT, json);

router.route("/text/:code")
  .post(validateJWT, text);

router.route("/:code")
  .post(validateJWT, boom);

export default router;
