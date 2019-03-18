import Boom from "boom";
import passport from "passport";
import User from "../../../../models/User";

export default {
  login: (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, data) => {
      if (err) {
        return next(err);
      } else if (!data.token) {
        // auditLog("authentication", {
        //   action: "invalid",
        //   method: "basic",
        //   username: req.body.username,
        // });

        return next(Boom.unauthorized());
      }

      const { expires, token, username } = data;

      // console.log(data);

      // auditLog("authentication", {
      //   action: "login",
      //   method: "basic",
      //   username: data.user.username,
      // });

      res.json({
        expires,
        token,
      });
    })(req, res, next);
  },

  logout: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      // console.log(user);

      // auditLog("authentication", {
      //   action: "logout",
      //   method: "",
      //   username: user.username,

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
  },

  saml: () => {
    passport.authenticate("saml", { session: false });
  },

  samlResponse: (req, res, next) => {
    passport.authenticate("saml", { session: false }, (err, data) => {
      if (err) {
        return next(err);
      } else if (!data.token) {
        // auditLog("authentication", {
        //   action: "invalid",
        //   method: "saml",
        //   username: "unknown",
        // });

        return next(Boom.unauthorized());
      }

      // } else if (data.user.username) {
      //   auditLog("authentication", {
      //     action: "login",
      //     method: "saml",
      //     username: data.user.username,
      //   });

      res.redirect(`/?token=${data.token}`);
    })(req, res, next);
  },

  valid: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, err => {
      if (err) {
        return next(err);
      }

      res.sendStatus(200);
    })(req, res, next);
  },
};
