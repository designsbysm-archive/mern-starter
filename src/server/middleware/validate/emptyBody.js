import Boom from "@hapi/boom";
import isEmpty from "../../tools/isEmpty";

export default (req, res, next) => {
  if (isEmpty(req.body)) {
    return next(Boom.badData("request body missing"));
  }

  next();
};
