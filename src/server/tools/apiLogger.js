const auditLog = require('./auditLog');
const moment = require('moment');

export function apiLogger(tokens, req, res) {
    const body = req.body;
    const code = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    const username = req.user ? req.user.username : 'unknown';

    // only log api calls (except sessions)
    if (
        !url.startsWith('/api/') ||
        url.includes('/sessions/')
    ) {
        return null;
    }

    auditLog.log('api', {
        body: body,
        code: code,
        method: method,
        timestamp: moment().toISOString(),
        url: url,
        username: username,
    });

    return null;
}
