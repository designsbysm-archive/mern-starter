const config = require('../config');
const dbModels = require('../tools/dbModels');
const dotenv = require('dotenv');
const fs = require('fs');
const LocalStrategy = require('passport-local').Strategy;
const Model = dbModels.getModel('users');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const path = require('path');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const SamlStrategy = require('passport-saml').Strategy;

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

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
