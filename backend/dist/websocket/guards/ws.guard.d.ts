import { JwtService } from '@nestjs/jwt';
import { IAuthenticatedSocket } from '../types';
import { JwtConfig } from '../../config/types';
export declare class WsJwtGuard {
    private jwtService;
    private jwtConfig;
    constructor(jwtService: JwtService, jwtConfig: JwtConfig);
    verify(client: IAuthenticatedSocket): Promise<IAuthenticatedSocket>;
    private extractToken;
}
