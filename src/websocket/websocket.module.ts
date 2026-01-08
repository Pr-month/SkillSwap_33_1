import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateways/notifications.gateway';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class WebSocketModule {}
