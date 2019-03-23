import express from "express";
import passport from "passport";
import { login, logout, valid } from "./controller";

const router = express.Router();
const validateJWT = passport.authenticate("jwt");

router.route("/login")
  .post(login);

router.route("/logout")
  .post(validateJWT, logout);

router.route("/valid")
  .post(validateJWT, valid);

export default router;
