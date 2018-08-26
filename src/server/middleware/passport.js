const config = require('../config');
const passport = require('passport');
const dbModels = require('../tools/dbModels');
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
const Model = dbModels.getModel('users');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// load .env variables
dotenv.config();

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret,
    }, (jwtPayload, done) => {
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

passport.use(new OIDCStrategy({
        clientID: process.env.SAML_APPLICATION_ID,
        cookieEncryptionKeys: JSON.parse(process.env.SAML_COOKIE_KEYS),
        identityMetadata: `https://login.microsoftonline.com/${process.env.SAML_TENANT_ID}/v2.0/.well-known/openid-configuration`,
        passReqToCallback: false,
        redirectUrl: process.env.SAML_REDIRECT_URL,
        responseMode: 'form_post',
        responseType: 'id_token',
        useCookieInsteadOfSession: true,
    }, (profile, done) => {
        console.log(iss, sub, profile, accessToken, refreshToken);
        // if (!profile.email) {
        //     return done(new Error("No email found"), null);
        // }
        // // asynchronous verification, for effect...
        // process.nextTick(function () {
        //     findByEmail(profile.email, function (err, user) {
        //         if (err) {
        //             return done(err);
        //         }
        //         if (!user) {
        //             // "Auto-registration"
        //             users.push(profile);
        //             return done(null, profile);
        //         }
        return done(null, {
            user: 'test',
        });
        //     });
        // });
    },
));
