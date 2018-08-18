const log = require('fancy-log');

module.exports = (err, req, res, next) => {
    let code = 500;
    const result = {
        message: 'unknown error',
        status: 'error',
    };

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

    }

    res.status(code).json(result);
};
