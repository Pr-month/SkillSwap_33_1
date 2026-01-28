"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlossariesController = void 0;
const common_1 = require("@nestjs/common");
const glossaries_service_1 = require("./glossaries.service");
const glossaries_swagger_1 = require("./glossaries.swagger");
let GlossariesController = class GlossariesController {
    glossariesService;
    constructor(glossariesService) {
        this.glossariesService = glossariesService;
    }
    async findAll() {
        return this.glossariesService.getAllGlossaries();
    }
    async findByCode(code) {
        const glossary = await this.glossariesService.getGlossaryMetadata(code);
        if (!glossary)
            throw new common_1.NotFoundException(`Справочник '${code}' не найден`);
        return glossary;
    }
    async findItems(code, page = 1, limit = 10, search = '') {
        const { items, total } = await this.glossariesService.getItems(code, {
            page,
            limit,
            search,
        });
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(code, id) {
        const item = await this.glossariesService.getItem(code, id);
        if (!item) {
            throw new common_1.NotFoundException(`Элемент справочника с ID '${id}' не найден в справочнике '${code}'`);
        }
        return item;
    }
    async postItem(code, data) {
        return this.glossariesService.postItem(code, data);
    }
};
exports.GlossariesController = GlossariesController;
__decorate([
    (0, common_1.Get)(),
    (0, glossaries_swagger_1.ApiGetAllGlossaries)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GlossariesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, glossaries_swagger_1.ApiGetGlossaryByCode)(),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlossariesController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':code/items'),
    (0, glossaries_swagger_1.ApiGetGlossaryItems)(),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GlossariesController.prototype, "findItems", null);
__decorate([
    (0, common_1.Get)(':code/items/:id'),
    (0, glossaries_swagger_1.ApiGetGlossaryItemById)(),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GlossariesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':code/items'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GlossariesController.prototype, "postItem", null);
exports.GlossariesController = GlossariesController = __decorate([
    (0, common_1.Controller)('v1/glossaries'),
    __metadata("design:paramtypes", [glossaries_service_1.GlossariesService])
], GlossariesController);
//# sourceMappingURL=glossaries.controller.js.map