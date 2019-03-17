import controller from "./controller";
import express from "express";
import passport from "passport";

const router = express.Router();
const validateJWT = passport.authenticate("jwt");

router.route("/")
  .get(validateJWT, controller.read);

export default router;
