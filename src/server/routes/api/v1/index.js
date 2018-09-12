const passport = require('passport');
const router = require('express').Router({ mergeParams: true });

// api endpoints
router.use('/sessions', require('./sessions'));
router.use('/users', passport.authenticate('jwt'), require('./users'));
router.use('/:kind', passport.authenticate('jwt'), require('./crud'));

module.exports = router;
