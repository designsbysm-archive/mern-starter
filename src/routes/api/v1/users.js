import express from "express";
import dbModelGet from "../../tools/dbModelGet";
import { secret } from "../../../config";

const Model = dbModelGet("users");
const router = express.Router();

router.get("/", (req, res, next) => {
  const model = new Model();
  const token = model.decodeToken(req.headers.authorization, secret);

  Model.findOne({ _id: token.id }, (err, user) => {
    if (err) {
      return next(err);
    }

    res.json(user);
  });
});

router.post("/", (req, res, next) => {
  if (!req.checkAuthRole("admin")) {
    return res.sendStatus(401);
  }

  const user = new Model(req.body);
  user.password = user.generatePasswordHash(req.body.password);

  user.save(error => {
    if (error) {
      return next(error);
    }

    res.sendStatus(201);
  });
});

router.put("/:id", (req, res, next) => {
  if (!req.checkAuthRole("admin")) {
    return res.sendStatus(401);
  }

  const id = req.params.id;
  const user = new Model();
  req.body.password = user.generatePasswordHash(req.body.password);

  Model.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      next(error);
    });
});

router.post("/query", (req, res) => {
  res.sendStatus(404);
});

export default router;
