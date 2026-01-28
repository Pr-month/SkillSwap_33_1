"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetGlossaryItemById = exports.ApiGetGlossaryItems = exports.ApiGetGlossaryByCode = exports.ApiGetAllGlossaries = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
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
const ApiGetAllGlossaries = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить список всех справочников' }), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Список справочников',
    example: glossaryListExample,
}));
exports.ApiGetAllGlossaries = ApiGetAllGlossaries;
const ApiGetGlossaryByCode = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить метаданные справочника по коду' }), (0, swagger_1.ApiParam)({
    name: 'code',
    required: true,
    description: 'Код справочника (например, "cities_ru")',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Метаданные справочника',
    example: glossaryMetadataExample,
}), (0, swagger_1.ApiResponse)({ status: 404, description: 'Справочник не найден' }));
exports.ApiGetGlossaryByCode = ApiGetGlossaryByCode;
const ApiGetGlossaryItems = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить элементы справочника с пагинацией' }), (0, swagger_1.ApiParam)({
    name: 'code',
    required: true,
    description: 'Код справочника (например, "cities_ru")',
}), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }), (0, swagger_1.ApiQuery)({
    name: 'search',
    required: false,
    type: String,
    example: 'Абакан',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Элементы справочника с информацией о пагинации',
    example: glossaryItemsResponseExample,
}));
exports.ApiGetGlossaryItems = ApiGetGlossaryItems;
const ApiGetGlossaryItemById = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить один элемент справочника по ID' }), (0, swagger_1.ApiParam)({
    name: 'code',
    required: true,
    description: 'Код справочника (например, "cities_ru")',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    required: true,
    description: 'Уникальный идентификатор элемента (UUID)',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Элемент справочника',
    example: cityItemExample,
}), (0, swagger_1.ApiResponse)({ status: 404, description: 'Элемент справочника не найден' }));
exports.ApiGetGlossaryItemById = ApiGetGlossaryItemById;
//# sourceMappingURL=glossaries.swagger.js.map