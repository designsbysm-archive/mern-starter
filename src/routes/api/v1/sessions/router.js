import express from "express";
import passport from "passport";
import { login, logout, valid } from "./controller";

const router = express.Router();
const validateJWT = passport.authenticate("jwt");

router.route("/login")
  .post(login);

router.route("/logout")
  .post(validateJWT, logout);

// router.route("/saml")
//   .get(controller.saml);

// router.route("/saml/response")
//   .post(controller.samlResponse);

router.route("/valid")
  .post(validateJWT, valid);

export default router;
