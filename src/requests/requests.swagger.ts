import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

export const ApiCreateRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Отправить заявку на обмен навыками' }),
    ApiBody({ type: CreateRequestDto }),
    ApiResponse({ status: 201, description: 'Заявка успешно создана' }),
    ApiResponse({ status: 400, description: 'Некорректные данные' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );

export const ApiGetIncomingRequests = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить входящие заявки (pending/inProgress)' }),
    ApiResponse({ status: 200, description: 'Список входящих заявок' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );

export const ApiGetOutgoingRequests = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить исходящие заявки (pending/inProgress)' }),
    ApiResponse({ status: 200, description: 'Список исходящих заявок' }),
    ApiResponse({ status: 401, description: 'Неавторизован' }),
  );

export const ApiUpdateRequest = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Обновить статус входящей заявки (принять/отклонить)',
    }),
    ApiParam({ name: 'id', description: 'ID заявки' }),
    ApiBody({ type: UpdateRequestDto }),
    ApiResponse({ status: 200, description: 'Заявка обновлена' }),
    ApiResponse({ status: 403, description: 'Нет прав на обновление' }),
    ApiResponse({ status: 404, description: 'Заявка не найдена' }),
  );

export const ApiDeleteRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Удалить заявку (свою или любую для админа)' }),
    ApiParam({ name: 'id', description: 'ID заявки' }),
    ApiResponse({ status: 200, description: 'Заявка удалена' }),
    ApiResponse({ status: 403, description: 'Нет прав на удаление' }),
    ApiResponse({ status: 404, description: 'Заявка не найдена' }),
  );
