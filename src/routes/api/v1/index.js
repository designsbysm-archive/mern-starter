import express from "express";
import passport from "passport";

const router = express.Router({ mergeParams: true });

router.use("/sessions", require("./sessions"));
router.use("/users", passport.authenticate("jwt"), require("./users"));
router.use("/:kind", passport.authenticate("jwt"), require("./crud"));

export default router;
