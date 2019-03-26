import express from "express";
import { notAllowed } from "./v1/crud/controller";
import v1 from "./v1";

const router = express.Router();

router.use("/v1", v1);
router.all("*", notAllowed);

export default router;
