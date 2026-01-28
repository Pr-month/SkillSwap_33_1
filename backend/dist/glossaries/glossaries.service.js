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
exports.GlossariesService = void 0;
const common_1 = require("@nestjs/common");
let GlossariesService = class GlossariesService {
    providers;
    constructor(providers) {
        this.providers = providers;
    }
    getAllGlossaries() {
        const promises = Array.from(this.providers.values()).map(async (p) => {
            const meta = p.getMetadata
                ? await p.getMetadata()
                : { name: p.code, description: '' };
            const { total: itemCount } = await p.findAll({
                page: 0,
                limit: 0,
                search: '',
            });
            return {
                code: p.code,
                name: meta.name,
                description: meta.description,
                itemCount,
            };
        });
        return Promise.all(promises);
    }
    getGlossary(code) {
        const provider = this.providers.get(code);
        if (!provider)
            throw new common_1.NotFoundException(`Glossary '${code}' not found`);
        return provider;
    }
    async getGlossaryMetadata(code) {
        const provider = this.getGlossary(code);
        if (!provider)
            return null;
        const meta = provider.getMetadata
            ? await provider.getMetadata()
            : { name: code, description: '' };
        const { total: itemCount } = await provider.findAll({
            page: 0,
            limit: 0,
            search: '',
        });
        return {
            code,
            ...meta,
            itemCount,
        };
    }
    async getItems(code, params) {
        if (params.page < 0 || params.limit < 0)
            throw new common_1.BadRequestException('Номер страницы или лимит элементов не могут быть меньше 0');
        params.page = Math.floor(params.page);
        params.limit = Math.floor(params.limit);
        const provider = this.getGlossary(code);
        if (!provider)
            throw new common_1.NotFoundException(`Glossary '${code}' not found`);
        return provider.findAll(params);
    }
    async getItem(code, id) {
        const provider = this.getGlossary(code);
        return provider.findOne(id);
    }
    async postItem(code, data) {
        const provider = this.getGlossary(code);
        return provider.create(data);
    }
};
exports.GlossariesService = GlossariesService;
exports.GlossariesService = GlossariesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GLOSSARY_PROVIDERS_MAP')),
    __metadata("design:paramtypes", [Map])
], GlossariesService);
//# sourceMappingURL=glossaries.service.js.map