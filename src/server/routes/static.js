const express = require("express");
const router = express.Router();
const path = require("path");
const assetFolder = "/../client";

router.use("/", express.static(path.join(__dirname, assetFolder)));

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, assetFolder, "/views", "app.html"));
});

module.exports = router;
