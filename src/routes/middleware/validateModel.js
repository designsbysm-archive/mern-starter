import Boom from "boom";
import getModel from "../tools/getModel";

export default parameter => (req, res, next) => {
  const schema = req.params[parameter];
  const Model = getModel(schema);

  if (!Model) {
    return next(Boom.badRequest(`model not found: ${schema}`));
  }

  next();
};
