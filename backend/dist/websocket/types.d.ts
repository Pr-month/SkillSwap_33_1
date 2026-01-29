import { Socket } from 'socket.io';
import { TJwtPayload } from 'src/auth/types';
export interface IAuthenticatedSocket extends Socket {
    data: {
        user: TJwtPayload;
    };
}
