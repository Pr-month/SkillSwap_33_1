import { Socket } from 'socket.io';
import { WsJwtGuard } from './guards/ws.guard';
import { Logger } from '@nestjs/common';

export class BaseGateway {
  private readonly logger = new Logger('ws');

  constructor(private readonly wsGuard: WsJwtGuard) {}

  protected async handleConnection(client: Socket) {
    try {
      const authenticatedClient = await this.wsGuard.verify(client);
      await authenticatedClient.join(authenticatedClient.data.user.sub);
    } catch (e) {
      this.logger.warn((e as Error).message);
      client.disconnect();
    }
  }
}
