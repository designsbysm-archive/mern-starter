import express from "express";
import { read, update } from "./controller";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";
import validateJWT from "../../../../middleware/validateJWT";

const router = express.Router({ mergeParams: true });

router
  .route("/:key")
  .get(validateJWT, read)
  .put(validateJWT, validateEmptyBody, update);

export default router;
