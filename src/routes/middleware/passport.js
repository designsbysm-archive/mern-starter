import "dotenv/config";
import { secret } from "../../config";
import fs from "fs";
import Model from "../../models/User";
import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import passportSAML from "passport-saml";
import path from "path";

const certFile = path.resolve(process.env.SAML_CERT);
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const SamlStrategy = passportSAML.Strategy;

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

passport.use(
  new SamlStrategy(
    {
      callbackUrl: process.env.SAML_REDIRECT_URL,
      cert: fs.readFileSync(certFile, "utf-8"),
      entryPoint: `https://login.microsoftonline.com/${process.env.SAML_TENANT_ID}/saml2`,
      issuer: process.env.SAML_APPLICATION_ID,
      signatureAlgorithm: "sha256",
    },
    (profile, done) => {
      Model.findOne({
        type: "saml",
        username: profile.nameID,
      })
        .collation({
          locale: "en",
          strength: 2,
        })
        .select("active")
        .select("name")
        .select("role")
        .select("type")
        .select("updatedAt")
        .select("username")
        .exec((err, user) => {
          if (err) {
            return done(err);
          }

          const firstName = profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || "";
          const lastName = profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || "";

          if (!user) {
            const upsertUser = new Model({
              name: {
                first: firstName,
                last: lastName,
              },
              role: "tech",
              type: "saml",
              username: profile.nameID,
            });

            upsertUser
              .save()
              .then(doc => {
                const result = new Model(doc);
                const data = user.generateToken(secret);
                const { expires, token } = data;

                return done(null, {
                  expires,
                  token,
                  user: result,
                });
              })
              .catch(() => {
                return done(null, false, {
                  message: "unauthorized",
                });
              });
          } else {
            return done(null, false, {
              message: "unauthorized",
            });
          }
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
