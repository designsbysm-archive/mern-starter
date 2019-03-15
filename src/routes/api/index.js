import Boom from "boom";
import express from "express";
import v1 from "./v1";

const router = express.Router();

router.use("/v1", v1);

// catch any unhandled /api calls
router.all("*", (req, res, next) => {
  next(Boom.notFound());
});

export default router;
