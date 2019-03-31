import "dotenv/config";
import { secret } from "../../config";
import fs from "fs";
import Model from "../../models/User";
import passport from "passport";
import passportSAML from "passport-saml";
import path from "path";

const certFile = path.resolve(process.env.SAML_CERT);
const SamlStrategy = passportSAML.Strategy;

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
          } else if (user) {
            const data = user.generateToken(secret);
            const { expires, token } = data;

            return done(null, {
              expires,
              token,
              user,
            });
          }

          const upsertUser = new Model({
            name: {
              first: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || "",
              last: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || "",
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
        });
    },
  ),
);
