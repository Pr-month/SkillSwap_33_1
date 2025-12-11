import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => {
  const expiresInStr = process.env.JWT_EXPIRES_IN || '86400';

  // Чтобы не было ошибки типизации useFactory в app.module
  // JWT_EXPIRES_IN всегда Number || undefined, если передано некорректное значение - ошибка
  const expiresInNum = Number(expiresInStr);

  if (isNaN(expiresInNum) || expiresInNum <= 0) {
    throw new Error(
      `Недопустимое числовое значение для JWT_EXPIRES_IN: ${expiresInStr}. Должно быть положительное число в секундах.`
    );
  }

  return {
    secret: process.env.JWT_SECRET || 'jwtsecret',
    expiresIn: expiresInNum,
  };
});
