const config = require('../config');
const passport = require('passport');
const dbModels = require('../tools/dbModels');
const LocalStrategy = require('passport-local').Strategy;
const Model = dbModels.getModel('users');

passport.use(new LocalStrategy(
    function (username, password, done) {
        Model.findOne({ username: username, })
            .collation({ locale: 'en', strength: 2 })
            .select('password')
            .select('username')
            .select('updatedAt')
            .select('role')
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
                    });
                } else {
                    return done(null, false, { message: 'unauthorized' });
                }
            });

    }
));
