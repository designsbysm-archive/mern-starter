import { Request, Response } from 'express';
import { TokenIndexer } from 'morgan';
import moment = require('moment'); // tslint:disable-line
import config = require('../config');
import auditLog = require('./auditLog');

export function morganAPI(tokens: TokenIndexer, req: Request, res: Response): any {
    const body = req.body;
    const code = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    const username = req.user ? req.user.username : 'unknown';

    // only log api calls (except sessions)
    if (
        !url.startsWith('/api/') ||
        (config.environment !== 'debug' && url.includes('/sessions/'))
    ) {
        return null;
    }

    if (body.password) {
        body.password = '*****';
    }

    auditLog.log('api', {
        'body': body,
        'code': code,
        'method': method,
        'timestamp': moment().toISOString(),
        'url': url,
        'username': username,
    });

    return null;
}
