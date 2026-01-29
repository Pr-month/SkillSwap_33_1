import { BaseGateway } from '../../base.gateway';
import { NotificationPayload } from './types';
import { WsJwtGuard } from '../../guards/ws.guard';
export declare class NotificationsGateway extends BaseGateway {
    private server;
    constructor(wsGuard: WsJwtGuard);
    sendNotification(recieverId: string, payload: NotificationPayload): void;
}
