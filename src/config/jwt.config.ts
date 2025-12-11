import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('JWT_CONFIG', () => {
  const expiresInStr = process.env.JWT_EXPIRES_IN || '3600';
  const refreshExpiresInStr = process.env.JWT_REFRESH_EXPIRES_IN || (60 * 60 * 24 * 7).toString();

  // Для обхода ошибки типизации useFactory в app.module
  const expiresInNum = Number(expiresInStr);
  const refreshExpiresInNum = Number(refreshExpiresInStr);

  if (isNaN(expiresInNum) || expiresInNum <= 0) {
    throw new Error(
      `Недопустимое числовое значение для JWT_EXPIRES_IN: ${expiresInStr}. Должно быть положительное число в секундах.`,
    );
  }

  if (isNaN(refreshExpiresInNum) || refreshExpiresInNum <= 0) {
    throw new Error(
      `Недопустимое числовое значение для JWT_REFRESH_EXPIRES_IN: ${refreshExpiresInStr}. Должно быть положительное число в секундах.`,
    );
  }

  return {
    secret: process.env.JWT_SECRET || 'jwtsecret',
    expiresIn: expiresInNum,
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    refreshExpiresIn: refreshExpiresInNum,
  };
});