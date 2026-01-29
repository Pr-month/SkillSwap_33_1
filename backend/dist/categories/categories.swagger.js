"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeleteCategory = exports.ApiUpdateCategory = exports.ApiGetCategoryById = exports.ApiGetAllCategories = exports.ApiCreateCategory = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const ApiCreateCategory = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Создать категорию навыков' }), (0, swagger_1.ApiBody)({ type: create_category_dto_1.CreateCategoryDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Категория создана' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiCreateCategory = ApiCreateCategory;
const ApiGetAllCategories = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить все категории' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Категории получены' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiGetAllCategories = ApiGetAllCategories;
const ApiGetCategoryById = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить категорию по её идентификатору' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID категории навыка',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiResponse)({ status: 200, description: 'Категория найдена' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Категория не найдена' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiGetCategoryById = ApiGetCategoryById;
const ApiUpdateCategory = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Обновить категорию с определенным идентификатором',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID категории навыка',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiBody)({ type: update_category_dto_1.UpdateCategoryDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Категория обновлена' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Категория не найдена' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiUpdateCategory = ApiUpdateCategory;
const ApiDeleteCategory = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Удаление категории с определенным идентификатором',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID категории навыка',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiResponse)({ status: 200, description: 'Категория обновлена' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Категория не найдена' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Пользователь неавторизован' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Доступ запрещён (не админ)' }));
exports.ApiDeleteCategory = ApiDeleteCategory;
//# sourceMappingURL=categories.swagger.js.map