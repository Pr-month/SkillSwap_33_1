import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { jwtConfig as jwtCnf } from 'src/config/jwt.config';
import { JwtConfig } from 'src/config/types';
import { BaseGateway } from '../base.gateway';

@WebSocketGateway({ namespace: '/notifications' })
export class NotificationsGateway extends BaseGateway {
  @WebSocketServer()
  private server: Namespace;

  constructor(
    jwtService: JwtService,
    @Inject(jwtCnf.KEY) jwtConfig: JwtConfig,
  ) {
    super(jwtService, jwtConfig);
  }

  //Базовый метод показывающий пример как отправлять уведомления на клиенты
  //Дто уведомлений и логику составления оповещений в подходящем формате еще надо будет добавить
  sendNotification(userId: string, notification: string) {
    const userClients = this.clientsMap.get(userId);
    if (!userClients) return;

    userClients.forEach((clientId) => {
      const clientSocket = this.server.sockets.get(clientId);
      if (!clientSocket) return;
      clientSocket.emit('notification', notification);
    });
  }
}
