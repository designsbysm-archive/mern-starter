import express from "express";
import error from "./error/router";

const router = express.Router();

router.use("/error", error);

export default router;
