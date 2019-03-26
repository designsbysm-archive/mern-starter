import { environment, saml } from "../../../../config";
import passport from "passport";

const read = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    } else if (!req.user && user) {
      req.user = user;
    }

    let server = {
      saml,
    };

    if (user) {
      server = {
        environment,
        saml,
        user: {
          name: {
            first: user.name.first,
            last: user.name.last,
          },
          role: user.role,
          username: user.username,
        },
      };
    }

    res.json(server);
  })(req, res, next);
};

export { read };
