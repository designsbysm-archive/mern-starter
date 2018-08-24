const auditLog = require('../tools/auditLog');
const moment = require('moment');

module.exports = (req, res, next) => {
    if (req.user && req.user.username) {
        const data = {
            body: JSON.stringify(req.body),
            method: req.method,
            status: res.statusCode,
            timestamp: moment().toISOString(),
            url: req.originalUrl,
            username: req.user.username,
        };

        const header = [
            'timestamp',
            'username',
            'method',
            'url',
            'body',
            'status',
        ];

        auditLog.log('api', data, header);
    }

    next();
};
