import express from "express";
import dbModelGet from "../../tools/dbModelGet";
import jsonStream from "JSONStream";
import mongoose from "mongoose";
import parseQueryFind from "../../tools/parseQueryFind";

const router = express.Router({ mergeParams: true });

router.delete("/", (req, res, next) => {
  if (!req.checkAuthRole("admin")) {
    return res.sendStatus(401);
  }

  const kind = req.params.kind;
  const Model = dbModelGet(kind);

  Model.remove({})
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
});

router.delete("/:id", (req, res, next) => {
  if (!req.checkAuthRole("admin")) {
    return res.sendStatus(401);
  }

  const id = req.params.id;
  const kind = req.params.kind;
  const Model = dbModelGet(kind);

  Model.remove({ _id: id })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/", (req, res) => {
  const kind = req.params.kind;
  const Model = dbModelGet(kind);

  res.type("json");
  Model.find({})
    .cursor()
    .pipe(jsonStream.stringify())
    .pipe(res);
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const kind = req.params.kind;
  const Model = dbModelGet(kind);

  Model.findOne({ _id: id })
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      next(err);
    });
});

router.post("/", (req, res, next) => {
  if (!req.checkAuthRole("super")) {
    return res.sendStatus(401);
  }
  if (!req.body) {
    return next({
      code: "noRequestData",
      status: "error",
    });
  }

  const kind = req.params.kind;
  const Model = dbModelGet(kind);
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

router.put("/", (req, res, next) => {
  if (!req.checkAuthRole("super")) {
    return res.sendStatus(401);
  }

  const kind = req.params.kind;
  const Model = dbModelGet(kind);
  const bulk = Model.collection.initializeOrderedBulkOp();
  const updates = req.body;

  updates.forEach(update => {
    // update = dbTools.convertUpdateFields(update);
    bulk.find({ _id: mongoose.Types.ObjectId(update.id) })
      .update(update.updates);
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

router.put("/:id", (req, res, next) => {
  if (!req.checkAuthRole("super")) {
    return res.sendStatus(401);
  }

  const id = req.params.id;
  const kind = req.params.kind;
  const Model = dbModelGet(kind);

  Model.findOneAndUpdate({ _id: id }, req.body, { upsert: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
});

router.post("/import", (req, res, next) => {
  if (!req.checkAuthRole("super")) {
    return res.sendStatus(401);
  }
  if (!req.body) {
    return next({
      code: "noRequestData",
      status: "error",
    });
  }

  const kind = req.params.kind;
  const Model = dbModelGet(kind);

  // TODO: change to .map
  const queue = [];
  req.body.forEach(item => {
    const create = new Model(item);
    queue.push(create.save());
  });

  Promise.all(queue)
    .then(docs => {
      res.send(docs);
    })
    .catch(err => {
      next(err);
    });
});

router.post("/query", (req, res) => {
  const kind = req.params.kind;
  const Model = dbModelGet(kind);
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
