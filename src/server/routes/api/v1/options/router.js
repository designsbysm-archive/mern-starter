import express from "express";
import { read, update } from "./controller";
import { validateEmptyBody, validateJWT } from "../../../../middleware/validate";

const router = express.Router({ mergeParams: true });

router
  .route("/:key")
  .get(validateJWT, read)
  .put(validateJWT, validateEmptyBody, update);

export default router;
