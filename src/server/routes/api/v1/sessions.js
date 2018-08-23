const dbModels = require('../../../tools/dbModels');
const Log = dbModels.getModel('auditlogin');
const router = require('express').Router();
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, data) => {
        if (err) {
            return next(err);
        }

        if (!data.token) {
            return res.sendStatus(401);
        }

        if (data.user.username) {
            const action = new Log({
                action: 'login',
                username: data.user.username,
            });
            action.save();
        }

        res.json({
            token: data.token,
        });
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, token) => {
        if (err) {
            return next(err);
        }

        if (token.username) {
            const action = new Log({
                action: 'logout',
                username: token.username,
            });
            action.save();
        }
    })(req, res, next);
});
module.exports = router;
