import Boom from "boom";
import getModel from "../../../../tools/getModel";
import jsonStream from "JSONStream";
import parseQueryFind from "../../../../tools/parseQueryFind";

export default {
  create: (req, res, next) => {
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
  },

  deleteOne: (req, res, next) => {
    const { id, kind } = req.params;
    const Model = getModel(kind);

    Model.remove({ _id: id })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        next(err);
      });
  },

  notAllowed: (req, res, next) => {
    next(Boom.notFound());
  },

  query: (req, res) => {
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
  },

  readAll: (req, res) => {
    const { kind } = req.params;
    const Model = getModel(kind);

    res.type("json");
    Model.find({})
      .cursor()
      .pipe(jsonStream.stringify())
      .pipe(res);
  },

  readOne: (req, res, next) => {
    const { id, kind } = req.params;
    const Model = getModel(kind);

    Model.findOne({ _id: id })
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        next(err);
      });
  },

  update: (req, res, next) => {
    const { id, kind } = req.params;
    const Model = getModel(kind);

    Model.findOneAndUpdate({ _id: id }, req.body, { upsert: true })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        next(err);
      });
  },
};
