import passport from "passport";
import passportLocal from "passport-local";

export default ({ Model, secret }) => {
  const LocalStrategy = passportLocal.Strategy;

  passport.use(
    new LocalStrategy((username, password, done) => {
      Model.findOne({
        type: "basic",
        username,
      })
        .collation({
          locale: "en",
          strength: 2,
        })
        .select("active")
        .select("name")
        .select("password")
        .select("role")
        .select("type")
        .select("updatedAt")
        .select("username")
        .exec((err, user) => {
          if (err) {
            return done(err);
          } else if (!user || !password || !user.active) {
            return done(null, false, {
              message: "unauthorized",
            });
          } else if (user.validatePasswordHash(password)) {
            const data = user.generateToken(secret);
            const { expires, token } = data;

            return done(null, {
              expires,
              token,
              user,
            });
          } else {
            return done(null, false, {
              message: "unauthorized",
            });
          }
        });
    }),
  );
};
