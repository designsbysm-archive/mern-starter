import { sleep } from "./controller";
import express from "express";
import { validateJWT } from "../../../../../middleware/validate";

const router = express.Router({ mergeParams: true });

router.route("/:ms")
  .get(validateJWT, sleep);

export default router;
