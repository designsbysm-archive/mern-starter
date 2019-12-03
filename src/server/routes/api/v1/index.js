import express from "express";
import crud from "./crud/router";
import mock from "./mock";
import options from "./options/router";
import sessions from "./sessions/router";
import rest from "./rest/router";
import server from "./server/router";
import users from "./users/router";

const router = express.Router();

router.use("/mock", mock);
router.use("/options", options);
router.use("/rest", rest);
router.use("/sessions", sessions);
router.use("/server", server);
router.use("/users", users);
router.use("/:kind", crud);

export default router;
