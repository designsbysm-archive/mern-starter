const dbModels = require('../../../tools/dbModels');
const Log = dbModels.getModel('auditlogin');
const router = require('express').Router();
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, data) => {
        if (err) {
            return next(err);
        } else if (!data.token) {
            return res.sendStatus(401);
        } else if (data.user.username) {
            const action = new Log({
                action: 'login',
                username: data.user.username,
            });
            action.save();
        } else {
            return next('error logging in');
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
        } else if (token.username) {
            const action = new Log({
                action: 'logout',
                username: token.username,
            });
            action.save();

            const Model = dbModels.getModel('users');
            Model.findOneAndUpdate({ username: token.username }, {}).catch(updateError => {
                next(updateError);
            });
        } else {
            return next('error logging out');
        }

        res.sendStatus(200);
    })(req, res, next);
});

module.exports = router;
