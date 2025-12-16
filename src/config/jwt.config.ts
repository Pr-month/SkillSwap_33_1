import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const jwtConfig = registerAs('JWT_CONFIG', () => {
  return {
    secret: process.env.JWT_SECRET || 'jwtsecret',
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      '1h') as JwtSignOptions['expiresIn'],

    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
      '7d') as JwtSignOptions['expiresIn'],
  };
});
