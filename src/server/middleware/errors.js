const auditLog = require('../tools/auditLog');
const log = require('fancy-log');
const moment = require('moment');

module.exports = (err, req, res, next) => {
    let code = 500;
    const result = {
        status: 'error',
        message: 'unknown error', // tslint:disable-line
    };

    // format the error data
    if (err instanceof Error) {
        if (err.name === 'StatusCodeError') {
            code = err.statusCode;

            try {
                const message = JSON.parse(err.error);
                result.message = message.error_message;
            } catch (Exception) {
                result.message = err.message;
            }

        } else if (err.name === 'MongoError' || err.message === 'Signature verification failed') {
            result.message = err.message;

        } else if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            code = 401;
            result.message = err.message;

        } else {
            log.error(err);
            result.message = err.message;
        }

    } else if (err.status) {
        result.status = err.status;

        switch (err.code) {
            case 'noRequestData':
                result.message = 'request body missing';
                break;

            case 'noResultData':
                result.message = 'no results from database';
                break;

            default:
                result.message = err.code;
        }

        if (err.message) {
            result.message = err.message;
        }

        switch (err.status) {
            case 'success':
            case 'warning':
                code = 200;
                break;

            case 'error':
                break;
        }

    } else if (err.code) {
        result.message = err.code;

    } else if (typeof(err) === 'string') {
        result.message = err;

    }

    // log the error message
    auditLog.log('error', {
        code: code,
        message: result.message,
        status: result.status,
        timestamp: moment().toISOString(),
    });

    res.status(code).json(result);
};
