const express = require('express');
const router = express.Router();

// middleware
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended : false }));
router.use(require('../middleware/checkAuthRole'));
require('../middleware/passport');
router.use(require('../middleware/errors'));

// api endpoints
router.use('/api', require('./api/index'));
router.use('/', require('./static'));

module.exports = router;
