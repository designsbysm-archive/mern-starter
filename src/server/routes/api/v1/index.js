const auditAPIAction = require('../../../middleware/auditAPIAction');
const passport = require('passport');
const router = require('express').Router({ mergeParams: true });

// api endpoints
router.use('/sessions', require('./sessions'));
router.use('/users', passport.authenticate('jwt', { session: false }), require('./users'));
router.use('/:kind', passport.authenticate('jwt', { session: false }), auditAPIAction, require('./crud'));

module.exports = router;
