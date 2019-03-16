import express from "express";
import passport from "passport";
import controller from "./controller";

const router = express.Router();
const validateJWT = passport.authenticate("jwt");

router.route("/login")
  .post(controller.login);

router.route("/logout")
  .post(validateJWT, controller.logout);

router.route("/saml")
  .get(controller.saml);

router.route("/saml/response")
  .post(controller.samlResponse);

router.route("/valid")
  .post(validateJWT, controller.valid);

export default router;
