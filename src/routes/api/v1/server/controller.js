import { environment, saml } from "../../../../config";
import passport from "passport";

export default {
  read: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      const server = {
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

      res.json(server);
    })(req, res, next);
  },
};
