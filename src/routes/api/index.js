import express from "express";
import crudController from "../../controllers/api/v1/crud";
import v1Route from "./v1";

const router = express.Router();

router.use("/v1", v1Route);
router.all("*", crudController.notAllowed);

export default router;
