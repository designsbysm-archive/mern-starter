// const dbModels = require('../../../tools/dbModels');
// const Log = dbModels.getModel('auditlogin');
const router = require('express').Router();
// const passport = require('passport');

router.post('/login', (req, res, next) => {
    console.log('login');

    passport.authenticate('saml', { session: false }, (err, data) => {
        // console.log('login');
        // if (err) {
        //     return next(err);
        // } else if (!data.token) {
        //     return res.sendStatus(401);
        // } else if (data.user.username) {
        //     auditLog.log('authentication', {
        //         action: 'login',
        //         method: 'basic',
        //         timestamp: moment().toISOString(),
        //         username: data.user.username,
        //     }, logHeader);
        // }
        //
        // res.json({
        //     token: data.token,
        // });

        res.sendStatus(200);
    })(req, res, next);
});

router.post('/login/response', (req, res, next) => {
    console.log('login responses');

    res.sendStatus(200);
});

router.post('/logout', (req, res, next) => {
    console.log('logout');

    res.sendStatus(200);
});

router.post('/logout/responses', (req, res, next) => {
    console.log('logout responses');

    res.sendStatus(200);
});

module.exports = router;
