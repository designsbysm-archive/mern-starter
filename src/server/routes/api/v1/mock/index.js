import express from "express";
import error from "./error/router";
import rest from "./rest/router";
import sleep from "./sleep/router";

const router = express.Router();

router.use("/error", error);
router.use("/rest", rest);
router.use("/sleep", sleep);

export default router;
