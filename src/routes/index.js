import api from "./api";
import checkAuthRole from "./middleware/checkAuthRole";
import errors from "./middleware/errors";
import express from "express";
import _static from "./static";

const router = express.Router();
require("./middleware/passport");

router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ extended: false }));
router.use(checkAuthRole);
router.use(errors);

router.use("/api", api);
router.use("/", _static);

export default router;
