import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';

export const ApiGetMe = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить данные текущего пользователя' }),
    ApiResponse({ status: 200, description: 'Текущий пользователь' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );

export const ApiPatchMe = () =>
  applyDecorators(
    ApiOperation({ summary: 'Обновить данные текущего пользователя' }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({ status: 200, description: 'Данные пользователя обновлены' }),
    ApiResponse({ status: 400, description: 'Некорректные данные' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );

export const ApiUpdatePassword = () =>
  applyDecorators(
    ApiOperation({ summary: 'Сменить пароль текущего пользователя' }),
    ApiBody({ type: UpdatePasswordDto }),
    ApiResponse({ status: 200, description: 'Пароль успешно изменён' }),
    ApiResponse({ status: 400, description: 'Некорректные данные' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );

export const ApiCreateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Создать пользователя (админ или системный сценарий)',
    }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({ status: 201, description: 'Пользователь создан' }),
    ApiResponse({ status: 400, description: 'Некорректные данные' }),
    ApiResponse({ status: 401, description: 'Пользователь неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );

export const ApiFindAllUsers = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить список пользователей' }),
    ApiResponse({ status: 200, description: 'Список пользователей' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );

export const ApiFindOne = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить пользователя по id' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID пользователя',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiResponse({ status: 200, description: 'Пользователь найден' }),
    ApiResponse({ status: 404, description: 'Пользователь не найден' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );

export const ApiUpdateUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Обновить пользователя по id' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID пользователя',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({ status: 200, description: 'Пользователь обновлён' }),
    ApiResponse({ status: 404, description: 'Пользователь не найден' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );

export const ApiRemoveUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Удалить пользователя' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID пользователя',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiResponse({ status: 200, description: 'Пользователь удалён' }),
    ApiResponse({ status: 404, description: 'Пользователь не найден' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );
