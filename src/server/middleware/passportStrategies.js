import "dotenv/config";
import { secret } from "../config";
import Model from "../models/User";
import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    (jwtPayload, done) => {
      return Model.findOne({
        _id: jwtPayload.id,
        active: true,
        updatedAt: jwtPayload.updated,
      })
        .then(user => {
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
    },
  ),
);

passport.use(
  new LocalStrategy((username, password, done) => {
    Model.findOne({
      type: "basic",
      username: username,
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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
