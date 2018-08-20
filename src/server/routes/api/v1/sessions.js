const router = require('express').Router();
const config = require('../../../config');
const dbModels = require('../../../tools/dbModels');
const Model = dbModels.getModel('users');

router.post('/', (req, res, next) => {
    Model.findOne({
        username: req.body.username,
    })
        .collation({ locale: 'en', strength: 2 })
        .select('password')
        .select('username')
        .select('updatedAt')
        .select('role')
        .exec((err, user) => {
            if (err) {
                return next(err);
            }

            if (!user || !req.body.password) {
                return res.sendStatus(401);
            }

            if (user.validatePasswordHash(req.body.password)) {
                res.json({
                    token: user.generateToken(config.secret),
                });
            } else {
                return res.sendStatus(401);
            }
        });
});

module.exports = router;
