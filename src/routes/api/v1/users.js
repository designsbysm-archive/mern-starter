import Boom from "boom";
import express from "express";
import { secret } from "../../../config";
import User from "../../../models/User";
import validateEmptyBody from "../../middleware/validateEmptyBody";
import validateRole from "../../middleware/validateRole";

const router = express.Router();

router.get("/", (req, res, next) => {
  const user = new User();
  const token = user.decodeToken(req.headers.authorization, secret);

  User.findOne({ _id: token.id }, (err, doc) => {
    if (err) {
      return next(err);
    }

    res.json(doc);
  });
});

router.post("/", validateRole("admin"), validateEmptyBody, (req, res, next) => {
  const user = new User(req.body);
  user.password = user.generatePasswordHash(req.body.password);

  user.save(err => {
    if (err) {
      return next(err);
    }

    res.sendStatus(201);
  });
});

router.put("/:id", validateRole("admin"), validateEmptyBody, (req, res, next) => {
  const { id } = req.params;
  const user = new User();
  req.body.password = user.generatePasswordHash(req.body.password);

  User.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      next(error);
    });
});

// TODO: remove
router.post("/query", (req, res, next) => {
  next(Boom.notFound());
});

export default router;
