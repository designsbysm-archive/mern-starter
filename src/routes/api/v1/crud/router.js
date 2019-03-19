import express from "express";
import { create, deleteOne, query, readAll, readOne, update } from "./controller";
import passport from "passport";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";
import validateModel from "../../../../middleware/validateModel";
import validateRole from "../../../../middleware/validateRole";

const router = express.Router({ mergeParams: true });
const validateJWT = passport.authenticate("jwt");

router
  .route("/")
  .get(validateJWT, validateModel("kind"), readAll)
  .post(validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, create);

router.route("/query")
  .post(validateJWT, validateRole("super"), validateModel("kind"), query);

router
  .route("/:id")
  .delete(validateJWT, validateRole("admin"), validateModel("kind"), deleteOne)
  .get(validateJWT, validateModel("kind"), readOne)
  .put(validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, update);

export default router;
