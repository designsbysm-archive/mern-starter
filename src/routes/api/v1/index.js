import express from "express";
import crudRoute from "./crud";
import sessionsRoute from "./sessions";
import usersRoute from "./users";

const router = express.Router();

router.use("/sessions", sessionsRoute);
router.use("/users", usersRoute);
router.use("/:kind", crudRoute);

export default router;
