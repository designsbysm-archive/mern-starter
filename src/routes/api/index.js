import express from "express";
import controller from "./v1/crud/controller";
import v1 from "./v1";

const router = express.Router();

router.use("/v1", v1);
router.all("*", controller.notAllowed);

export default router;
