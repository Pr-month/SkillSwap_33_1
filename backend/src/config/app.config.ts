import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('APP_CONFIG', () => ({
  port: Number(process.env.PORT) || 3000,
  environment: process.env.NODE_ENV || 'development',
  hashSalt: process.env.HASH_SALT || 10,
}));
