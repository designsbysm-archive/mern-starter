const jwt = require('jwt-simple');
const config = require('../config');
const dbModels = require('../tools/dbModels');
const Model = dbModels.getModel('users');

module.exports = (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return next();
    }

    authHeader = authHeader.replace('Bearer ', '');

    try {
        const token = jwt.decode(authHeader, config.secret);

        Model.findOne({ username: token.username, updatedAt: token.updated }).then(user => {
            if (user) {
                req.auth = token;
            }
        }).catch(err => {
            return next(err);
        }).finally(() => {
            next();
        });
    }
    catch (err) {
        return next(err);
    }
};
