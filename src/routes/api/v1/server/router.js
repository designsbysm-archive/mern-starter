import { read } from "./controller";
import express from "express";
import passport from "passport";

const router = express.Router();
const validateJWT = passport.authenticate("jwt");

router.route("/")
  .get(validateJWT, read);

export default router;
