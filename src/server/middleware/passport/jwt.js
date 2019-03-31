import "dotenv/config";
import { secret } from "../../config";
import Model from "../../models/User";
import passport from "passport";
import passportJWT from "passport-jwt";

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
