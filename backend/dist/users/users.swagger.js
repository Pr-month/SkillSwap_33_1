"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRemoveUser = exports.ApiUpdateUser = exports.ApiFindOne = exports.ApiFindAllUsers = exports.ApiCreateUser = exports.ApiUpdatePassword = exports.ApiPatchMe = exports.ApiGetMe = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const ApiGetMe = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить данные текущего пользователя' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Текущий пользователь' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiGetMe = ApiGetMe;
const ApiPatchMe = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Обновить данные текущего пользователя' }), (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Данные пользователя обновлены' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiPatchMe = ApiPatchMe;
const ApiUpdatePassword = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Сменить пароль текущего пользователя' }), (0, swagger_1.ApiBody)({ type: update_password_dto_1.UpdatePasswordDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Пароль успешно изменён' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiUpdatePassword = ApiUpdatePassword;
const ApiCreateUser = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Создать пользователя (админ или системный сценарий)',
}), (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Пользователь создан' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiCreateUser = ApiCreateUser;
const ApiFindAllUsers = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить список пользователей' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Список пользователей' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiFindAllUsers = ApiFindAllUsers;
const ApiFindOne = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить пользователя по id' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID пользователя',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь найден' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Пользователь не найден' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiFindOne = ApiFindOne;
const ApiUpdateUser = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Обновить пользователя по id' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID пользователя',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь обновлён' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Пользователь не найден' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiUpdateUser = ApiUpdateUser;
const ApiRemoveUser = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Удалить пользователя' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID пользователя',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь удалён' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Пользователь не найден' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiRemoveUser = ApiRemoveUser;
//# sourceMappingURL=users.swagger.js.map