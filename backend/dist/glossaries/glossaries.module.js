"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlossariesModule = void 0;
const common_1 = require("@nestjs/common");
const glossaries_service_1 = require("./glossaries.service");
const glossaries_controller_1 = require("./glossaries.controller");
const glossaries_providers_1 = require("./glossaries.providers");
const cities_module_1 = require("../cities/cities.module");
let GlossariesModule = class GlossariesModule {
};
exports.GlossariesModule = GlossariesModule;
exports.GlossariesModule = GlossariesModule = __decorate([
    (0, common_1.Module)({
        imports: [cities_module_1.CitiesModule],
        providers: [glossaries_service_1.GlossariesService, ...glossaries_providers_1.GLOSSARY_PROVIDERS],
        controllers: [glossaries_controller_1.GlossariesController],
        exports: [glossaries_service_1.GlossariesService],
    })
], GlossariesModule);
//# sourceMappingURL=glossaries.module.js.map