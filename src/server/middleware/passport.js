const config = require('../config');
const passport = require('passport');
const dbModels = require('../tools/dbModels');
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
const Model = dbModels.getModel('users');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const SAMLStrategy = require('passport-saml').Strategy;

// load .env variables
dotenv.config();
const samlCert = path.resolve(process.env.SAML_CERT);

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret,
    },
    (jwtPayload, done) => {
        // find the user, make sure they haven't been updated
        Model.findOne({ username: jwtPayload.username, updatedAt: jwtPayload.updated }).then(user => {
            return done(null, user);
        }).catch(err => {
            return done(err);
        });
    },
));

passport.use(new LocalStrategy(
    (username, password, done) => {
        Model.findOne({ username: username })
            .collation({ locale: 'en', strength: 2 })
            .select('password')
            .select('role')
            .select('updatedAt')
            .select('username')
            .exec((err, user) => {
                if (err) {
                    return done(err);
                }

                if (!user || !password) {
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

passport.use(new SAMLStrategy({
        authnContext: process.env.SAML_AUTH_CONTEXT,
        callbackUrl: process.env.SAML_LOGIN_RESPONSE,
        cert: samlCert,
        entryPoint: process.env.SAML_URL,
        identifierFormat: null,
        issuer: process.env.SAML_LOGIN_RESPONSE,
    },
    (profile, done) => {
        console.log(profile);

        // findByEmail(profile.email, function(err, user) {
        //     if (err) {
        //         return done(err);
        //     }
        return done(null, 'user');
        // });
    }),
);
