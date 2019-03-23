import { tokenClear, tokenGet } from "./controller";
import express from "express";
import validateJWT from "../../../../middleware/validateJWT";

const router = express.Router();

router
  .route("/token")
  .delete(validateJWT, tokenClear)
  .get(validateJWT, tokenGet);

export default router;
