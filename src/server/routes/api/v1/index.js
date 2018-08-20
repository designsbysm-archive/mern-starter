const bodyParser = require('body-parser');
const passport = require('passport');
const router = require('express').Router({ mergeParams: true });

// middleware
router.use(bodyParser.json());

// api endpoints
router.use('/sessions', require('./sessions'));
router.use('/users', passport.authenticate('jwt', { session: false }), require('./users'));
router.use('/:kind', passport.authenticate('jwt', { session: false }), require('./crud'));

module.exports = router;
