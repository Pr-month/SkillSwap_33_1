import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';

export const ApiRefreshToken = () =>
  applyDecorators(
    ApiOperation({ summary: 'Обновить access/refresh токены' }),
    ApiHeader({
      name: 'Authorization',
      description: 'Refresh токен в формате Bearer <token>',
      schema: {
        type: 'string',
        example:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwic3ViIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NjMyMzE4NiwiZXhwIjoxNzY2MzI2Nzg2fQ.Y_QXobmyFsjsgEjT-9sTLbe78em_gSgmHxvOzZt9ULk',
      },
    }),
    ApiResponse({ status: 201, description: 'Токены успешно обновлены' }),
    ApiResponse({
      status: 401,
      description: 'Неверный или просроченный refresh токен',
    }),
  );

export const ApiLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Логин пользователя' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: 200,
      description: 'Успешная аутентификация, выдача токенов',
    }),
    ApiResponse({ status: 401, description: 'Неверные учетные данные' }),
  );

export const ApiRegister = () =>
  applyDecorators(
    ApiOperation({ summary: 'Регистрация нового пользователя' }),
    ApiBody({ type: CreateAuthDto }),
    ApiResponse({
      status: 201,
      description: 'Пользователь успешно зарегистрирован',
    }),
    ApiResponse({
      status: 400,
      description: 'Некорректные данные регистрации',
    }),
  );

export const ApiLogout = () =>
  applyDecorators(
    ApiOperation({ summary: 'Выход пользователя (logout)' }),
    ApiResponse({ status: 200, description: 'Пользователь разлогинен' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );
