// const dbModels = require('../../../tools/dbModels');
// const Log = dbModels.getModel('auditlogin');
const router = require('express').Router();
// const passport = require('passport');

router.post('/login', (req, res, next) => {
    console.log('login');

    res.sendStatus(200);
});

router.post('/logout', (req, res, next) => {
    console.log('logout');

    res.sendStatus(200);
});

module.exports = router;
