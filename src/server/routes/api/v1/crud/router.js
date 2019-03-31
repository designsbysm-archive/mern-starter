import { create, deleteOne, query, readAll, readOne, update } from "./controller";
import express from "express";
import validateEmptyBody from "../../../../middleware/validate/emptyBody";
import validateModel from "../../../../middleware/validate/model";
import validateJWT from "../../../../middleware/validate/jwt";
import validateRole from "../../../../middleware/validate/role";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(validateJWT, validateModel("kind"), readAll)
  .post(validateJWT, validateModel("kind"), validateRole("super"), validateEmptyBody, create);

router.route("/query")
  .post(validateJWT, validateModel("kind"), validateRole("super"), query);

router
  .route("/:id")
  .delete(validateJWT, validateModel("kind"), validateRole("admin"), deleteOne)
  .get(validateJWT, validateModel("kind"), readOne)
  .put(validateJWT, validateModel("kind"), validateRole("super"), validateEmptyBody, update);

export default router;
