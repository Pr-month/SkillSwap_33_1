import { Inject, Injectable } from '@nestjs/common'; // Добавили Inject
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../../config/jwt.config'; // Новый импорт
import { JwtConfig } from '../../config/types'; // Новый импорт

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@Inject(jwtConfig.KEY) config: JwtConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.refreshSecret,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
