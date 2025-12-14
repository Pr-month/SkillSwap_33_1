import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig as jwtCnf } from 'src/config/jwt.config';
import { JwtConfig } from 'src/config/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtCnf.KEY) private readonly jwtConfig: JwtConfig,
    private usersService: UsersService,
  ) {}

  private generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: this.jwtConfig.expiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  //Заменить на тип TJwtPayload при готовности
  async refresh(user: { sub: string }) {
    const { accessToken, refreshToken } = this.generateTokens(user);
    await this.usersService.refresh(user.sub, refreshToken);
    return { accessToken, refreshToken };
  }
}
