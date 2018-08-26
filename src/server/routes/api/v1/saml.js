const router = require('express').Router();
const passport = require('passport');

router.get('/login', passport.authenticate('azuread-openidconnect', {}));

router.post('/login/response',
    (req, res, next) => {
        passport.authenticate('azuread-openidconnect', (err, data) => {
            console.log(err, data);

            res.redirect('/');
        })(req, res, next);
    },
    // (req, res) => {
    //     log.info('We received a return from AzureAD.');
    // },
);

module.exports = router;
