import crud from "./crud";
import express from "express";
import passport from "passport";
import sessions from "./sessions";
import users from "./users";

const auth = passport.authenticate("jwt");
const router = express.Router({ mergeParams: true });

router.use("/sessions", sessions);
router.use("/users", auth, users);
router.use("/:kind", auth, crud);

export default router;
