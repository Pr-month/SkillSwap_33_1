"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUploadFile = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiUploadFile = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Загрузить изображение' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
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
}), (0, swagger_1.ApiResponse)({
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
}));
exports.ApiUploadFile = ApiUploadFile;
//# sourceMappingURL=files.swagger.js.map