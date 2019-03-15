import Boom from "boom";
import getModel from "../../tools/getModel";
import express from "express";
import jsonStream from "JSONStream";
import mongoose from "mongoose";
import parseQueryFind from "../../tools/parseQueryFind";
import validateEmptyBody from "../../middleware/validateEmptyBody";
import validateModel from "../../middleware/validateModel";
import validateRole from "../../middleware/validateRole";

const router = express.Router({ mergeParams: true });

router.delete("/", validateRole("admin"), validateModel("kind"), (req, res, next) => {
  const { kind } = req.params;
  const Model = getModel(kind);

  Model.remove({})
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
});

router.delete("/:id", validateRole("admin"), validateModel("kind"), (req, res, next) => {
  const { id, kind } = req.params;
  const Model = getModel(kind);

  Model.remove({ _id: id })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/", validateModel("kind"), (req, res, next) => {
  const { kind } = req.params;
  const Model = getModel(kind);

  res.type("json");
  Model.find({})
    .cursor()
    .pipe(jsonStream.stringify())
    .pipe(res);
});

router.get("/:id", validateRole("super"), validateModel("kind"), (req, res, next) => {
  const { id, kind } = req.params;
  const Model = getModel(kind);

  Model.findOne({ _id: id })
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.post("/", validateRole("super"), validateModel("kind"), validateEmptyBody, (req, res, next) => {
  const { kind } = req.params;
  const Model = getModel(kind);
  const item = new Model(req.body);

  item
    .save()
    .then(doc => {
      res.send(doc._id);
    })
    .catch(err => {
      next(err);
    });
});

router.put("/", validateRole("super"), validateModel("kind"), validateEmptyBody, (req, res, next) => {
  const { kind } = req.params;
  const Model = getModel(kind);
  const bulk = Model.collection.initializeOrderedBulkOp();
  const updates = req.body;

  updates.forEach(item => {
    bulk.find({ _id: mongoose.Types.ObjectId(item.id) })
      .update(item.updates);
  });

  if (bulk.length > 0) {
    bulk.execute((err, result) => {
      if (err) {
        return next(err);
      }
      res.send(result);
    });
  }
});

router.put("/:id", validateRole("super"), validateModel("kind"), validateEmptyBody, (req, res, next) => {
  const { id, kind } = req.params;
  const Model = getModel(kind);

  Model.findOneAndUpdate({ _id: id }, req.body, { upsert: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
});

router.post("/query", validateModel("kind"), (req, res, next) => {
  const { kind } = req.params;
  const Model = getModel(kind);
  const query = parseQueryFind(req.body);

  res.type("json");
  Model.find(query.find)
    .limit(query.limit)
    .sort(query.sort)
    .cursor()
    .pipe(jsonStream.stringify())
    .pipe(res);
});

export default router;
