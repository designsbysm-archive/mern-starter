const config = require('../config');
const dbModels = require('../tools/dbModels');
const Model = dbModels.getModel('users');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next();
    }

    try {
        const model = new Model();
        const token = model.decodeToken(authHeader, config.secret);

        Model.findOne({ username: token.username, updatedAt: token.updated }).then(user => {
            // if valid user found, add auth token to req object
            if (user) {
                req.authToken = token;
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
