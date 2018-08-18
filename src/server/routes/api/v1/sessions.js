const router = require('express').Router();
const bcrypt = require('bcrypt');
const config = require('../../../config');
const dbModels = require('../../../tools/dbModels');
const jwt = require('jwt-simple');
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

            bcrypt.compare(req.body.password, user.password, (error, valid) => {
                if (error) {
                    return next(error);
                }
                if (!valid) {
                    return res.sendStatus(401);
                }

                const token = jwt.encode({
                        role: user.role,
                        updated: user.updatedAt,
                        username: user.username,
                    }, config.secret,
                );

                res.json({
                    token: token,
                });
            });
        });
});

module.exports = router;
