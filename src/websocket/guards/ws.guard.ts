import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConfig as jwtCnf } from 'src/config/jwt.config';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from 'src/config/types';
import { TJwtPayload } from 'src/auth/types';
import { IAuthenticatedSocket } from '../types';

@Injectable()
export class WsJwtGuard {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtCnf.KEY) private jwtConfig: JwtConfig,
  ) {}

  async verify(client: IAuthenticatedSocket): Promise<IAuthenticatedSocket> {
    const token = this.extractToken(client);
    if (!token) throw new UnauthorizedException('Token not provided');

    const { sub, email, role } = await this.jwtService.verifyAsync<TJwtPayload>(
      token,
      { secret: this.jwtConfig.secret },
    );

    client.data.user = { sub, email, role };

    return client;
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : null;
  }
}
