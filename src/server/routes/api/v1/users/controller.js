import User from "../../../../models/user";
import { secretBcrypt } from "../../../../config";

const create = (req, res, next) => {
  const user = new User(req.body);
  user.password = user.generatePasswordHash(req.body.password);

  user.save(err => {
    if (err) {
      return next(err);
    }

    res.sendStatus(201);
  });
};

const current = (req, res, next) => {
  const user = new User();
  const token = user.decodeToken(req.headers.authorization, secretBcrypt);

  User.findOne({ _id: token.id }, (err, doc) => {
    if (err) {
      return next(err);
    }

    res.json(doc);
  });
};

const update = (req, res, next) => {
  const { id } = req.params;

  if (req.body.password) {
    const user = new User();
    req.body.password = user.generatePasswordHash(req.body.password);
  }

  User.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      next(error);
    });
};

export { create, current, update };
