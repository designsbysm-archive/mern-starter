const router = require('express').Router();
const passport = require('passport');

router.post('/', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, token) => {
        if (err) {
            return next(err);
        }

        if (!token) {
            return res.sendStatus(401);
        }

        res.json(token);
    })(req, res, next);
});

module.exports = router;
