import { Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { BaseGateway } from '../../base.gateway';
import { NotificationPayload } from './types';
import { WsJwtGuard } from 'src/websocket/ws.guard';

@WebSocketGateway({ namespace: '/notifications' })
export class NotificationsGateway extends BaseGateway {
  @WebSocketServer()
  private server: Namespace;

  constructor(@Inject() wsGuard: WsJwtGuard) {
    super(wsGuard);
  }

  sendNotification(recieverId: string, payload: NotificationPayload) {
    this.server.to(recieverId).emit('notification', payload);
  }
}
