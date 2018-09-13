export interface IAddressInfo {
    address: string;
    family: string;
    port: number;
}

import { Request } from 'express';

export interface IGetUserAuthInfoRequest extends Request {
    user: {
        username: string,
    };
}
