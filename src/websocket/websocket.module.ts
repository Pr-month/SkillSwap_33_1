import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateways/notifications/notifications.gateway';
import { WsJwtGuard } from './ws.guard';

@Module({
  providers: [NotificationsGateway, WsJwtGuard],
  exports: [NotificationsGateway],
})
export class WebSocketModule {}
