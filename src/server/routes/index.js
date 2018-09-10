const router = require('express').Router();
const bodyParser = require('body-parser');

// middleware
router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ extended : true }));
router.use(require('../middleware/checkAuthRole'));
require('../middleware/passport');
router.use(require('../middleware/errors'));

// api endpoints
router.use('/api', require('./api/index'));
router.use('/', require('./static'));

module.exports = router;
