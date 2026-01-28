"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeleteRequest = exports.ApiUpdateRequest = exports.ApiGetOutgoingRequests = exports.ApiGetIncomingRequests = exports.ApiCreateRequest = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_request_dto_1 = require("./dto/create-request.dto");
const update_request_dto_1 = require("./dto/update-request.dto");
const ApiCreateRequest = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Отправить заявку на обмен навыками' }), (0, swagger_1.ApiBody)({ type: create_request_dto_1.CreateRequestDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Заявка успешно создана' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiCreateRequest = ApiCreateRequest;
const ApiGetIncomingRequests = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить входящие заявки (pending/inProgress)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Список входящих заявок' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiGetIncomingRequests = ApiGetIncomingRequests;
const ApiGetOutgoingRequests = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить исходящие заявки (pending/inProgress)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Список исходящих заявок' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiGetOutgoingRequests = ApiGetOutgoingRequests;
const ApiUpdateRequest = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Обновить статус входящей заявки (принять/отклонить)',
}), (0, swagger_1.ApiParam)({ name: 'id', description: 'ID заявки' }), (0, swagger_1.ApiBody)({ type: update_request_dto_1.UpdateRequestDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Заявка обновлена' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Нет прав на обновление' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Заявка не найдена' }));
exports.ApiUpdateRequest = ApiUpdateRequest;
const ApiDeleteRequest = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Удалить заявку (свою или любую для админа)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'ID заявки' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Заявка удалена' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Нет прав на удаление' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Заявка не найдена' }));
exports.ApiDeleteRequest = ApiDeleteRequest;
//# sourceMappingURL=requests.swagger.js.map