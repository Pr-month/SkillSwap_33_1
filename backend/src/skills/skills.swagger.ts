import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

export const ApiCreateSkill = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Создать навык' }),
    ApiBody({ type: CreateSkillDto }),
    ApiResponse({
      status: 201,
      description: 'Навык успешно создан',
    }),
  );

export const ApiGetSkills = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить список навыков' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Номер страницы (по умолчанию 1)',
      example: 1,
      default: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Размер страницы (по умолчанию 20)',
      example: 20,
      default: 20,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Поиск по названию/категории',
      example: 'Игра на барабанах',
      default: 'Игра на барабанах',
    }),
    ApiQuery({
      name: 'category',
      required: false,
      type: String,
      description: 'ID категории или родительской категории',
      example: 'Музыка',
      default: 'Музыка',
    }),
    ApiResponse({
      status: 200,
      description: 'Список навыков с пагинацией',
    }),
  );

export const ApiGetSkill = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить навык по id' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID навыка',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiResponse({
      status: 200,
      description: 'Навык найден',
    }),
    ApiResponse({
      status: 404,
      description: 'Навык не найден',
    }),
  );

export const ApiUpdateSkill = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Обновить навык' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID навыка',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiBody({ type: UpdateSkillDto }),
    ApiResponse({
      status: 200,
      description: 'Навык обновлён',
    }),
    ApiResponse({
      status: 403,
      description: 'Попытка обновить чужой навык',
    }),
    ApiResponse({
      status: 404,
      description: 'Навык не найден',
    }),
  );

export const ApiDeleteSkill = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Удалить навык' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID навыка',
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiResponse({
      status: 200,
      description: 'Навык удалён',
    }),
    ApiResponse({
      status: 403,
      description: 'Попытка удалить чужой навык',
    }),
    ApiResponse({
      status: 404,
      description: 'Навык не найден',
    }),
  );

export const ApiAddToFavorite = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Добавить навык в избранное' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID навыка',
    }),
    ApiResponse({
      status: 201,
      description: 'Навык добавлен в избранное',
    }),
    ApiResponse({
      status: 404,
      description: 'Навык не найден',
    }),
    ApiResponse({
      status: 409,
      description: 'Навык уже в избранном',
    }),
  );

export const ApiRemoveFromFavorite = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Удалить навык из избранного' }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID навыка',
    }),
    ApiResponse({
      status: 200,
      description: 'Навык удалён из избранного',
    }),
    ApiResponse({
      status: 404,
      description: 'Навык не найден в избранном',
    }),
  );
