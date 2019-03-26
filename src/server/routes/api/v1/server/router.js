import { read } from "./controller";
import express from "express";

const router = express.Router();

router.route("/")
  .get(read);

export default router;
