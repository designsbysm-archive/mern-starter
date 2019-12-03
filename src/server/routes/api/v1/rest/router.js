import { validateJWT } from "../../../../middleware/validate";
import express from "express";

const router = express.Router({ mergeParams: true });

const send200 = (req, res) => {
  res.sendStatus(200);
};

const send201 = (req, res) => {
  res.sendStatus(201);
};

router
  .route("/")
  .get(validateJWT, send200)
  .post(validateJWT, send201);

router
  .route("/:id")
  .delete(validateJWT, send200)
  .get(validateJWT, send200)
  .put(validateJWT, send200);

export default router;
