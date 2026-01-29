"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRemoveFromFavorite = exports.ApiAddToFavorite = exports.ApiDeleteSkill = exports.ApiUpdateSkill = exports.ApiGetSkill = exports.ApiGetSkills = exports.ApiCreateSkill = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const update_skill_dto_1 = require("./dto/update-skill.dto");
const ApiCreateSkill = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Создать навык' }), (0, swagger_1.ApiBody)({ type: create_skill_dto_1.CreateSkillDto }), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'Навык успешно создан',
}));
exports.ApiCreateSkill = ApiCreateSkill;
const ApiGetSkills = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить список навыков' }), (0, swagger_1.ApiQuery)({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию 1)',
    example: 1,
    default: 1,
}), (0, swagger_1.ApiQuery)({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Размер страницы (по умолчанию 20)',
    example: 20,
    default: 20,
}), (0, swagger_1.ApiQuery)({
    name: 'search',
    required: false,
    type: String,
    description: 'Поиск по названию/категории',
    example: 'Игра на барабанах',
    default: 'Игра на барабанах',
}), (0, swagger_1.ApiQuery)({
    name: 'category',
    required: false,
    type: String,
    description: 'ID категории или родительской категории',
    example: 'Музыка',
    default: 'Музыка',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Список навыков с пагинацией',
}));
exports.ApiGetSkills = ApiGetSkills;
const ApiGetSkill = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить навык по id' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID навыка',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Навык найден',
}), (0, swagger_1.ApiResponse)({
    status: 404,
    description: 'Навык не найден',
}));
exports.ApiGetSkill = ApiGetSkill;
const ApiUpdateSkill = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Обновить навык' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID навыка',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiBody)({ type: update_skill_dto_1.UpdateSkillDto }), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Навык обновлён',
}), (0, swagger_1.ApiResponse)({
    status: 403,
    description: 'Попытка обновить чужой навык',
}), (0, swagger_1.ApiResponse)({
    status: 404,
    description: 'Навык не найден',
}));
exports.ApiUpdateSkill = ApiUpdateSkill;
const ApiDeleteSkill = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Удалить навык' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID навыка',
    example: '11111111-2222-3333-4444-555555555555',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Навык удалён',
}), (0, swagger_1.ApiResponse)({
    status: 403,
    description: 'Попытка удалить чужой навык',
}), (0, swagger_1.ApiResponse)({
    status: 404,
    description: 'Навык не найден',
}));
exports.ApiDeleteSkill = ApiDeleteSkill;
const ApiAddToFavorite = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Добавить навык в избранное' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID навыка',
}), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'Навык добавлен в избранное',
}), (0, swagger_1.ApiResponse)({
    status: 404,
    description: 'Навык не найден',
}), (0, swagger_1.ApiResponse)({
    status: 409,
    description: 'Навык уже в избранном',
}));
exports.ApiAddToFavorite = ApiAddToFavorite;
const ApiRemoveFromFavorite = () => (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Удалить навык из избранного' }), (0, swagger_1.ApiParam)({
    name: 'id',
    type: String,
    description: 'ID навыка',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Навык удалён из избранного',
}), (0, swagger_1.ApiResponse)({
    status: 404,
    description: 'Навык не найден в избранном',
}));
exports.ApiRemoveFromFavorite = ApiRemoveFromFavorite;
//# sourceMappingURL=skills.swagger.js.map