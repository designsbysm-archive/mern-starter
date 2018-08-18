const router = require('express').Router({ mergeParams: true });
const bodyParser = require('body-parser');

// middleware
router.use(bodyParser.json());

// api endpoints
router.use('/sessions', require('./sessions'));
router.use('/users', require('./users'));
router.use('/:kind', require('./crud'));

module.exports = router;
