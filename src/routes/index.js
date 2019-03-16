import api from "./api";
import express from "express";
import path from "path";

require("../middleware/passport");
const router = express.Router();

router.use("/api", api);

// static files
router.use("/", express.static(path.join(__dirname, "..", "..", "client", "build")));
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "build", "index.html"));
});

export default router;
