const config = require('../config');

export function requestLogger(tokens, req, res) {
    if (config.environment !== 'debug') {
        return;
    }

    const status = res.statusCode;

    // get status color
    const color = status >= 500 ? 31 // red
        : status >= 400 ? 33 // yellow
            : status >= 300 ? 36 // cyan
                : status >= 200 ? 34 // blue
                    : 0; // no color

    return [
        '\x1b[37m' + tokens.method(req, res),
        '\x1b[' + color + 'm' + tokens.status(req, res),
        '\x1b[0m' + tokens.url(req, res),
    ].join(' ');
}
