const router = require("express")
  .Router();

// api endpoints
router.use("/v1", require("./v1/index"));

// catch any unhandled /api calls
router.all("*", (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
