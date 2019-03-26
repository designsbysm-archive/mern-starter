import { login, logout, valid } from "./controller";
import express from "express";
import validateJWT from "../../../../middleware/validateJWT";

const router = express.Router();

router.route("/login")
  .post(login);

router.route("/logout")
  .post(validateJWT, logout);

router.route("/valid")
  .post(validateJWT, valid);

export default router;
