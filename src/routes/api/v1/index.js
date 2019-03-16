import express from "express";
import crud from "./crud/router";
import sessions from "./sessions/router";
import users from "./users/router";

const router = express.Router();

router.use("/sessions", sessions);
router.use("/users", users);
router.use("/:kind", crud);

export default router;
