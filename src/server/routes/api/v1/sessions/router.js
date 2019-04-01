import { login, logout, saml, samlResponse, valid } from "./controller";
import express from "express";
import validateJWT from "../../../../middleware/validate/jwt";

const router = express.Router();

router.route("/login")
  .post(login);

router.route("/logout")
  .post(validateJWT, logout);

router.route("/saml")
  .get(saml);

router.route("/saml/response")
  .post(samlResponse);

router.route("/valid")
  .post(validateJWT, valid);

export default router;
