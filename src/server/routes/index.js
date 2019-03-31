import "../middleware/passport/jwt";
import "../middleware/passport/local";
import "../middleware/passport/setup";
import api from "./api";
import express from "express";
import path from "path";

const router = express.Router();

router.use("/api", api);

// static files
router.use("/", express.static(path.join(__dirname, "..", "..", "client")));
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "index.html"));
});

export default router;
