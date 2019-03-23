import express from "express";
import crud from "./crud/router";
import options from "./options/router";
import sessions from "./sessions/router";
import server from "./server/router";
import users from "./users/router";

const router = express.Router();

router.use("/options", options);
router.use("/sessions", sessions);
router.use("/server", server);
router.use("/users", users);
router.use("/:kind", crud);

export default router;
