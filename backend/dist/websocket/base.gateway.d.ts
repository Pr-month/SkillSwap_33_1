import { Socket } from 'socket.io';
import { WsJwtGuard } from './guards/ws.guard';
export declare class BaseGateway {
    private readonly wsGuard;
    private readonly logger;
    constructor(wsGuard: WsJwtGuard);
    protected handleConnection(client: Socket): Promise<void>;
}
