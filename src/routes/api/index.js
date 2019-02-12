import express from "express";

const router = express.Router();

router.use("/v1", require("./v1/index"));

// catch any unhandled /api calls
router.all("*", (req, res) => {
  res.sendStatus(404);
});

export default router;
