import express from "express";
import { read, update } from "./controller";
import validateEmptyBody from "../../../../middleware/validate/emptyBody";
import validateJWT from "../../../../middleware/validate/jwt";

const router = express.Router({ mergeParams: true });

router
  .route("/:key")
  .get(validateJWT, read)
  .put(validateJWT, validateEmptyBody, update);

export default router;
