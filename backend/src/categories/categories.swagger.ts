import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export const ApiCreateCategory = () =>
  applyDecorators(
    ApiOperation({ summary: 'Создать категорию навыков' }),
    ApiBody({ type: CreateCategoryDto }),
    ApiResponse({ status: 201, description: 'Категория создана' }),
    ApiResponse({ status: 400, description: 'Некорректные данные' }),
    ApiResponse({ status: 401, description: 'Пользователь неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );

export const ApiGetAllCategories = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить все категории' }),
    ApiResponse({ status: 200, description: 'Категории получены' }),
    ApiResponse({ status: 401, description: 'Пользователь неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );

export const ApiGetCategoryById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить категорию по её идентификатору' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID категории навыка',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiResponse({ status: 200, description: 'Категория найдена' }),
    ApiResponse({ status: 404, description: 'Категория не найдена' }),
    ApiResponse({ status: 401, description: 'Пользователь неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );

export const ApiUpdateCategory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Обновить категорию с определенным идентификатором',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID категории навыка',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiBody({ type: UpdateCategoryDto }),
    ApiResponse({ status: 200, description: 'Категория обновлена' }),
    ApiResponse({ status: 404, description: 'Категория не найдена' }),
    ApiResponse({ status: 401, description: 'Пользователь неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );

export const ApiDeleteCategory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Удаление категории с определенным идентификатором',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID категории навыка',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiResponse({ status: 200, description: 'Категория обновлена' }),
    ApiResponse({ status: 404, description: 'Категория не найдена' }),
    ApiResponse({ status: 401, description: 'Пользователь неавторизован' }),
    ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' }),
  );
