import Boom from "boom";
import getModel from "../tools/getModel";
import jsonStream from "JSONStream";
import parseQueryFind from "../tools/parseQueryFind";
import User from "../../models/User";
import { secret } from "../../config";

export default {
  create: (req, res, next) => {
    const user = new User(req.body);
    user.password = user.generatePasswordHash(req.body.password);

    user.save(err => {
      if (err) {
        return next(err);
      }

      res.sendStatus(201);
    });
  },

  read: (req, res, next) => {
    const user = new User();
    const token = user.decodeToken(req.headers.authorization, secret);

    User.findOne({ _id: token.id }, (err, doc) => {
      if (err) {
        return next(err);
      }

      res.json(doc);
    });
  },

  update: (req, res, next) => {
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
  },
};
