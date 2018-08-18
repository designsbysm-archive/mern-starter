const router = require('express').Router();
const authTools = require('../../../tools/authTools');
const bcrypt = require('bcrypt');
const dbModels = require('../../../tools/dbModels');
const config = require('../../../config');
const jwt = require('jwt-simple');
const Model = dbModels.getModel('users');

router.get('/', (req, res, next) => {
    if (!authTools.checkAuth(req.auth, '*') || !req.headers.authorization) {
        return res.sendStatus(401);
    }

    let authHeader = req.headers.authorization;
    authHeader = authHeader.replace('Bearer ', '');

    const auth = jwt.decode(authHeader, config.secret);

    Model.findOne({ username: auth.username }, (err, user) => {
        if (err) {
            return next(err);
        }

        res.json(user);
    });
});

router.post('/', (req, res, next) => {
    if (!authTools.checkAuth(req.auth, 'admin')) {
        return res.sendStatus(401);
    }

    const user = new Model(req.body);

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }

        user.password = hash;

        user.save(error => {
            if (error) {
                return next(err);
            }

            res.sendStatus(201);
        });
    });
});

router.put('/:id', (req, res, next) => {
    if (!authTools.checkAuth(req.auth, 'admin')) {
        return res.sendStatus(401);
    }

    const id = req.params.id;

    if (req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return next(err);
            }

            req.body.password = hash;

            Model.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(() => {
                res.sendStatus(200);
            }).catch(error => {
                next(error);
            });
        });
    }
});

router.post('/query', (req, res, next) => {
    res.sendStatus(404);
});

module.exports = router;
