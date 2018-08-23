const config = require('../config');
const passport = require('passport');
const dbModels = require('../tools/dbModels');
const LocalStrategy = require('passport-local').Strategy;
const Model = dbModels.getModel('users');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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