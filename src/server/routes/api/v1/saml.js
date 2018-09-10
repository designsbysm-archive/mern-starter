const router = require('express').Router();
const passport = require('passport');

router.get('/login', passport.authenticate('azuread-openidconnect', { session: false }));

router.post('/login/response', (req, res, next) => {
        passport.authenticate('azuread-openidconnect', { session: false }, (err, data) => {
            console.log('POST', '/login/response', err, data);

            res.redirect('/');
        })(req, res, next);
    },
);

module.exports = router;
