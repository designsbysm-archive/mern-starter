import "dotenv/config";
import { environment, secret } from "../../config";
// import fs from "fs";
import Model from "../../models/User";
import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
// import passportSAML from "passport-saml";
// import path from "path";

// const certFile = path.resolve(process.env.SAML_CERT);
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
// const SamlStrategy = passportSAML.Strategy;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    (jwtPayload, done) => {
      // find the user, make sure they haven't been updated
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
        }

        if (!user || !password || !user.active) {
          return done(null, false, {
            message: "unauthorized",
          });
        }

        if (user.validatePasswordHash(password)) {
          // if local dev don't update user
          if ([
            "debug",
            "development", 
          ].includes(environment)) {
            const result = new Model(user);
            const tokenData = result.generateToken(secret);

            return done(null, {
              expires: tokenData.expires,
              token: tokenData.token,
              user: result,
            });
          }

          Model.findOneAndUpdate(
            {
              username: user.username,
            },
            {
              $set: {
                lastLogin: new Date(),
              },
            },
            {
              new: true,
            },
          )
            .then(doc => {
              const result = new Model(doc);
              const tokenData = result.generateToken(secret);

              return done(null, {
                expires: tokenData.expires,
                token: tokenData.token,
                user: result,
              });
            })
            .catch(updateError => {
              return done(null, false, updateError);
            });
        } else {
          return done(null, false, {
            message: "unauthorized",
          });
        }
      });
  }),
);

// passport.use(
//   new SamlStrategy(
//     {
//       callbackUrl: process.env.SAML_REDIRECT_URL,
//       cert: fs.readFileSync(certFile, "utf-8"),
//       entryPoint: `https://login.microsoftonline.com/${process.env.SAML_TENANT_ID}/saml2`,
//       issuer: process.env.SAML_APPLICATION_ID,
//       signatureAlgorithm: "sha256",
//     },
//     (profile, done) => {
//       Model.findOne({
//         type: "saml",
//         username: profile.nameID,
//       })
//         .collation({
//           locale: "en",
//           strength: 2,
//         })
//         .select("active")
//         .select("name")
//         .select("role")
//         .select("type")
//         .select("updatedAt")
//         .select("username")
//         .exec((err, user) => {
//           if (err) {
//             return done(err);
//           }

//           const firstName = profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || "";
//           const lastName = profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || "";

//           if (!user) {
//             // add new user
//             const upsertUser = new Model({
//               lastLogin: new Date(),
//               name: {
//                 first: firstName,
//                 last: lastName,
//               },
//               role: "tech",
//               type: "saml",
//               username: profile.nameID,
//             });

//             upsertUser
//               .save()
//               .then(doc => {
//                 const result = new Model(doc);
//                 const tokenData = result.generateToken(secret);

//                 return done(null, {
//                   expires: tokenData.expires,
//                   token: tokenData.token,
//                   user: result,
//                 });
//               })
//               .catch(() => {
//                 return done(null, false, {
//                   message: "unauthorized",
//                 });
//               });
//           } else if (user) {
//             // update last login time
//             const update = {
//               $set: {
//                 lastLogin: new Date(),
//               },
//             };

//             // if name missing
//             if (!user.name.first || !user.name.last) {
//               update.$set.name = {
//                 first: firstName,
//                 last: lastName,
//               };
//             }

//             Model.findOneAndUpdate(
//               {
//                 username: user.username,
//               },
//               update,
//               {
//                 new: true,
//               },
//             )
//               .then(doc => {
//                 const result = new Model(doc);
//                 const tokenData = result.generateToken(secret);

//                 return done(null, {
//                   expires: tokenData.expires,
//                   token: tokenData.token,
//                   user: result,
//                 });
//               })
//               .catch(updateError => {
//                 return done(null, false, updateError);
//               });
//           } else {
//             return done(null, false, {
//               message: "unauthorized",
//             });
//           }
//         });
//     },
//   ),
// );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
