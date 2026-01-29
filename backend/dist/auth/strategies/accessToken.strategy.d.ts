import { Strategy } from 'passport-jwt';
import { JwtConfig } from '../../config/types';
import { TJwtPayload } from '../types';
declare const AccessTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    constructor(config: JwtConfig);
    validate(payload: TJwtPayload): TJwtPayload;
}
export {};
