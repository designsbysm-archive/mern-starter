import Boom from "boom";
import getModel from "../../../../tools/getModel";
import jsonStream from "JSONStream";
import parseQueryFind from "../../../../tools/parseQueryFind";

const create = (req, res, next) => {
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
};

const deleteOne = (req, res, next) => {
  const { id, kind } = req.params;
  const Model = getModel(kind);

  Model.remove({ _id: id })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
};

const notAllowed = (req, res, next) => {
  next(Boom.notFound(`Not Found: ${req.url}`));
};

const query = (req, res) => {
  const { kind } = req.params;
  const Model = getModel(kind);
  const { find, limit, sort } = parseQueryFind(req.body);

  res.type("json");
  Model.find(find)
    .limit(limit)
    .sort(sort)
    .cursor()
    .pipe(jsonStream.stringify())
    .pipe(res);
};

const readAll = (req, res) => {
  const { kind } = req.params;
  const Model = getModel(kind);

  res.type("json");
  Model.find({})
    .cursor()
    .pipe(jsonStream.stringify())
    .pipe(res);
};

const readOne = (req, res, next) => {
  const { id, kind } = req.params;
  const Model = getModel(kind);

  Model.findOne({ _id: id })
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      next(err);
    });
};

const update = (req, res, next) => {
  const { id, kind } = req.params;
  const Model = getModel(kind);

  Model.findOneAndUpdate({ _id: id }, req.body, { upsert: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
};

export { create, deleteOne, notAllowed, query, readAll, readOne, update };
