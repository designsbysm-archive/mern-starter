import { create, deleteOne, query, readAll, readOne, update } from "./controller";
import { validateEmptyBody, validateJWT, validateModel, validateRole } from "../../../../middleware/validate";
import express from "express";
import getModel from "../../../../tools/getModel";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(validateJWT, validateModel("kind", getModel), readAll)
  .post(validateJWT, validateModel("kind", getModel), validateRole("super"), validateEmptyBody, create);

router.route("/query")
  .post(validateJWT, validateModel("kind", getModel), validateRole("super"), query);

router
  .route("/:id")
  .delete(validateJWT, validateModel("kind", getModel), validateRole("admin"), deleteOne)
  .get(validateJWT, validateModel("kind", getModel), readOne)
  .put(validateJWT, validateModel("kind", getModel), validateRole("super"), validateEmptyBody, update);

export default router;
