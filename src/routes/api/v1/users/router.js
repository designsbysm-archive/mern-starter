import { create, current, update } from "./controller";
import { readAll, readOne } from "../crud/controller";
import express from "express";
import passport from "passport";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";
import validateRole from "../../../../middleware/validateRole";

const router = express.Router({ mergeParams: true });
const validateJWT = passport.authenticate("jwt");
const addKind = (req, res, next) => {
  req.params.kind = "users";
  next();
};

router
  .route("/")
  .get(validateJWT, validateRole("admin"), addKind, readAll)
  .post(validateJWT, validateRole("admin"), validateEmptyBody, create);

router.route("/current")
  .get(validateJWT, current);

router
  .route("/:id")
  .get(validateJWT, validateRole("admin"), addKind, readOne)
  .put(validateJWT, validateRole("admin"), validateEmptyBody, update);

export default router;
