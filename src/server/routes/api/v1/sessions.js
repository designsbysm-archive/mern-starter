const auditLog = require('../../../tools/auditLog');
const dbModels = require('../../../tools/dbModels');
const logHeader = [
    'timestamp',
    'username',
    'method',
    'action',
];
const moment = require('moment');
const passport = require('passport');
const router = require('express').Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, data) => {
        if (err) {
            return next(err);
        } else if (!data.token) {
            return res.sendStatus(401);
        } else if (data.user.username) {
            auditLog.log('authentication', {
                action: 'login',
                method: 'basic',
                timestamp: moment().toISOString(),
                username: data.user.username,
            }, logHeader);
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
            auditLog.log('authentication', {
                action: 'logout',
                method: 'basic',
                timestamp: moment().toISOString(),
                username: token.username,
            }, logHeader);

            // invalidate the current token
            const Model = dbModels.getModel('users');
            Model.findOneAndUpdate({ username: token.username }, {}).catch(updateError => {
                next(updateError);
            });
        }

        res.sendStatus(200);
    })(req, res, next);
});

module.exports = router;
