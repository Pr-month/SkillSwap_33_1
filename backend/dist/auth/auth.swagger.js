"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiLogout = exports.ApiRegister = exports.ApiLogin = exports.ApiRefreshToken = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("./dto/login.dto");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const ApiRefreshToken = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Обновить access/refresh токены' }), (0, swagger_1.ApiHeader)({
    name: 'Authorization',
    description: 'Refresh токен в формате Bearer <token>',
    schema: {
        type: 'string',
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwic3ViIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NjMyMzE4NiwiZXhwIjoxNzY2MzI2Nzg2fQ.Y_QXobmyFsjsgEjT-9sTLbe78em_gSgmHxvOzZt9ULk',
    },
}), (0, swagger_1.ApiResponse)({ status: 201, description: 'Токены успешно обновлены' }), (0, swagger_1.ApiResponse)({
    status: 401,
    description: 'Неверный или просроченный refresh токен',
}));
exports.ApiRefreshToken = ApiRefreshToken;
const ApiLogin = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Логин пользователя' }), (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Успешная аутентификация, выдача токенов',
}), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неверные учетные данные' }));
exports.ApiLogin = ApiLogin;
const ApiRegister = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Регистрация нового пользователя' }), (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
}), (0, swagger_1.ApiResponse)({
    status: 400,
    description: 'Некорректные данные регистрации',
}));
exports.ApiRegister = ApiRegister;
const ApiLogout = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Выход пользователя (logout)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь разлогинен' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Неавторизован' }));
exports.ApiLogout = ApiLogout;
//# sourceMappingURL=auth.swagger.js.map