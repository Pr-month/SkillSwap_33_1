import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TJwtPayload } from 'src/auth/types';
import { JwtConfig } from 'src/config/types';
import { Socket } from 'socket.io';

export class BaseGateway {
  protected clientsMap = new Map<string, Set<string>>();
  protected usersMap = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  protected async handleConnection(client: Socket) {
    const { sub } = await this.verify(client);

    let userClients = this.clientsMap.get(sub);
    if (!userClients) {
      userClients = new Set<string>();
      this.clientsMap.set(sub, userClients);
    }
    userClients.add(client.id);
    this.usersMap.set(client.id, sub);
  }

  protected handleDisconnect(client: Socket) {
    const userId = this.usersMap.get(client.id);
    this.usersMap.delete(client.id);
    if (!userId) return;
    const userClients = this.clientsMap.get(userId);
    if (!userClients) return;
    userClients.delete(client.id);
    if (userClients.size === 0) this.clientsMap.delete(userId);
  }

  private verify(client: Socket): Promise<TJwtPayload> {
    const token = this.extractToken(client);

    if (!token) throw new UnauthorizedException('Token not provided');

    return this.jwtService.verifyAsync<TJwtPayload>(token, {
      secret: this.jwtConfig.secret,
    });
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : null;
  }
}
