import express from "express";
import { read, update } from "./controller";
import passport from "passport";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";

const router = express.Router({ mergeParams: true });
const validateJWT = passport.authenticate("jwt");

router
  .route("/:key")
  .get(validateJWT, read)
  .put(validateJWT, validateEmptyBody, update);

export default router;
