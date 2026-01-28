import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

const glossaryMetadataExample = {
  name: 'Города России',
  description: 'Справочник городов РФ из открытых данных',
};

const cityItemExample = {
  id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  coords: {
    lat: '53.71667',
    lon: '91.41667',
  },
  district: 'Сибирский',
  name: 'Абакан',
  population: 184769,
  subject: 'Хакасия',
};

const glossaryListExample = [
  {
    code: 'cities_ru',
    name: 'Города России',
    description: 'Справочник городов РФ из открытых данных',
    itemCount: 1117,
  },
];

const glossaryItemsResponseExample = {
  items: [
    cityItemExample,
    {
      id: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9',
      coords: {
        lat: '52.65',
        lon: '90.083333333333',
      },
      district: 'Сибирский',
      name: 'Абаза',
      population: 12272,
      subject: 'Хакасия',
    },
  ],
  meta: {
    total: 1117,
    page: 1,
    limit: 10,
    totalPages: 112,
  },
};

export const ApiGetAllGlossaries = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить список всех справочников' }),
    ApiResponse({
      status: 200,
      description: 'Список справочников',
      example: glossaryListExample,
    }),
  );

export const ApiGetGlossaryByCode = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить метаданные справочника по коду' }),
    ApiParam({
      name: 'code',
      required: true,
      description: 'Код справочника (например, "cities_ru")',
    }),
    ApiResponse({
      status: 200,
      description: 'Метаданные справочника',
      example: glossaryMetadataExample,
    }),
    ApiResponse({ status: 404, description: 'Справочник не найден' }),
  );

export const ApiGetGlossaryItems = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить элементы справочника с пагинацией' }),
    ApiParam({
      name: 'code',
      required: true,
      description: 'Код справочника (например, "cities_ru")',
    }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      example: 'Абакан',
    }),
    ApiResponse({
      status: 200,
      description: 'Элементы справочника с информацией о пагинации',
      example: glossaryItemsResponseExample,
    }),
  );

export const ApiGetGlossaryItemById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить один элемент справочника по ID' }),
    ApiParam({
      name: 'code',
      required: true,
      description: 'Код справочника (например, "cities_ru")',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'Уникальный идентификатор элемента (UUID)',
    }),
    ApiResponse({
      status: 200,
      description: 'Элемент справочника',
      example: cityItemExample,
    }),
    ApiResponse({ status: 404, description: 'Элемент справочника не найден' }),
  );
