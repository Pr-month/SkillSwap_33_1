import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiUploadFile = () =>
  applyDecorators(
    ApiOperation({ summary: 'Загрузить изображение' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Файл изображения (jpeg, png, gif, webp) до 2 МБ',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
        required: ['file'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Файл успешно загружен, возвращается URL',
      schema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            example: '/uploads/drums-1.png',
            description: 'Путь к загруженному файлу',
          },
        },
      },
    }),
  );
