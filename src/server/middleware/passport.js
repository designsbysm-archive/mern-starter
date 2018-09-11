const config = require('../config');
const passport = require('passport');
const dbModels = require('../tools/dbModels');
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
const Model = dbModels.getModel('users');
// const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const SamlStrategy = require('passport-saml').Strategy;
const path = require('path');
const fs = require('fs');

// load .env variables
dotenv.config();
const certFile = path.resolve(process.env.SAML_CERT);

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret,
    }, (jwtPayload, done) => {
        // find the user, make sure they haven't been updated
        Model.findOne({
            active: true,
            updatedAt: jwtPayload.updated,
            username: jwtPayload.username,
        }).then(user => {
            return done(null, user);
        }).catch(err => {
            return done(err);
        });
    },
));

passport.use(new LocalStrategy(
    (username, password, done) => {
        Model.findOne({
            type: 'basic',
            username: username,
        })
            .collation({ locale: 'en', strength: 2 })
            .select('active')
            .select('password')
            .select('role')
            .select('type')
            .select('updatedAt')
            .select('username')
            .exec((err, user) => {
                if (err) {
                    return done(err);
                }

                if (!user || !password || !user.active) {
                    return done(null, false, { message: 'unauthorized' });
                }

                if (user.validatePasswordHash(password)) {
                    return done(null, {
                        token: user.generateToken(config.secret),
                        user: user,
                    });
                } else {
                    return done(null, false, { message: 'unauthorized' });
                }
            });

    },
));

// passport.use(new OIDCStrategy({
//         clientID: process.env.SAML_APPLICATION_ID,
//         cookieEncryptionKeys: JSON.parse(process.env.SAML_COOKIE_KEYS),
//         identityMetadata: `https://login.microsoftonline.com/${process.env.SAML_TENANT_ID}/v2.0/.well-known/openid-configuration/`,
//         loggingLevel: 'info', // TODO: remove after testing
//         loggingNoPII: false, // TODO: remove after testing
//         redirectUrl: process.env.SAML_REDIRECT_URL,
//         responseMode: 'form_post',
//         responseType: 'id_token',
//         scope: ['profile'],
//         useCookieInsteadOfSession: true,
//     }, (req, params, done) => {
//         console.log(req, params);
//
//         return done(null, {
//             user: 'test',
//         });
//     },
// ));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new SamlStrategy(
    {
        callbackUrl: process.env.SAML_REDIRECT_URL,
        cert: fs.readFileSync(certFile, 'utf-8'),
        entryPoint: `https://login.microsoftonline.com/${process.env.SAML_TENANT_ID}/saml2`,
        issuer: process.env.SAML_APPLICATION_ID,
        signatureAlgorithm: 'sha256',
    },
    (profile, done) => {
        Model.findOne({
            type: 'saml',
            username: profile.nameID,
        })
            .collation({ locale: 'en', strength: 2 })
            .select('active')
            .select('role')
            .select('type')
            .select('updatedAt')
            .select('username')
            .exec((err, user) => {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    const newUser = new Model({
                        role: 'tech',
                        type: 'saml',
                        username: profile.nameID,
                    });

                    return newUser.save().then(doc => {
                        const result = new Model(doc);

                        return done(null, {
                            token: result.generateToken(config.secret),
                            user: result,
                        });
                    }).catch(() => {
                        return done(null, false, { message: 'unauthorized' });
                    });
                }

                if (!user || !user.active) {
                    return done(null, false, { message: 'unauthorized' });
                }

                return done(null, {
                    token: user.generateToken(config.secret),
                    user: user,
                });
            });
    }),
);
