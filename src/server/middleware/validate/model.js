import Boom from "@hapi/boom";

export default (parameter, getModel) => (req, res, next) => {
  const schema = req.params[parameter];
  const Model = getModel(schema);

  if (!Model) {
    return next(Boom.badRequest(`model not found: ${schema}`));
  }

  next();
};
