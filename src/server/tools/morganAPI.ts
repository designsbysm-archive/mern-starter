import { Response } from 'express';
import { TokenIndexer } from 'morgan';
import { IGetUserAuthInfoRequest } from '../types/express';
import moment = require('moment'); // tslint:disable-line
import config = require('../config');
import auditLog = require('./auditLog');

export function morganAPI(tokens: TokenIndexer, req: IGetUserAuthInfoRequest, res: Response): any {
    const body = req.body;
    const code = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    const username = req.user ? req.user.username : 'unknown'; // tslint:disable-line

    // only log api calls (except sessions)
    if (
        !url.startsWith('/api/') ||
        (config.environment !== 'debug' && (
            url.includes('/sessions/') ||
            url.includes('/stats/')
        ))) {
        return null;
    }

    if (body.password) {
        body.password = '*****';
    }

    auditLog.log('api', {
        'body': JSON.stringify(body),
        'code': code,
        'method': method,
        'timestamp': moment().toISOString(),
        'url': url,
        'username': username,
    });

    return null;
}
