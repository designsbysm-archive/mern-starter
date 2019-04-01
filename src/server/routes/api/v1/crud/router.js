import { create, deleteOne, query, readAll, readOne, update } from "./controller";
import express from "express";
import { validateEmptyBody, validateJWT, validateModel, validateRole } from "../../../../middleware/validate";

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
