import Boom from "@hapi/boom";

export default role => (req, res, next) => {
  const user = req.user;

  if (!user || !user.role) {
    return next(Boom.unauthorized());
  } else if (user.role === "admin") {
    // allow access
  } else if (user.role !== role) {
    return next(Boom.unauthorized());
  }

  next();
};
