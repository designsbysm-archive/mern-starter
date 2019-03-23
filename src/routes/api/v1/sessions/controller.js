import Boom from "boom";
import Logger from "../../../../tools/fileLogger";
const logger = Logger("authentication");
import passport from "passport";
import User from "../../../../models/User";

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, data) => {
    if (err) {
      return next(err);
    } else if (!data.token) {
      logger.log({
        action: "invalid",
        level: "warn",
        stratagy: "basic",
        timestamp: new Date(),
        username: req.body.username,
      });

      return next(Boom.unauthorized());
    }

    const { expires, token, user } = data;
    const { username } = user;

    logger.log({
      action: "login",
      level: "info",
      stratagy: "basic",
      timestamp: new Date(),
      username: username,
    });

    res.json({
      expires,
      token,
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    const { type, username } = user;

    logger.log({
      action: "logout",
      level: "info",
      stratagy: type,
      timestamp: new Date(),
      username: username,
    });

    // invalidate the current token
    User.findOneAndUpdate({ _id: user.id }, {})
      .catch(updateError => {
        next(updateError);
      });

    if (req.session) {
      req.session.destroy();
    }

    res.sendStatus(200);
  })(req, res, next);
};

const valid = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, err => {
    if (err) {
      return next(err);
    }

    res.sendStatus(200);
  })(req, res, next);
};

export { login, logout, valid };
