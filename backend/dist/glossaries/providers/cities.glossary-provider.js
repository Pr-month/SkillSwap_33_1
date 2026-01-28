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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitiesGlossaryProvider = void 0;
const common_1 = require("@nestjs/common");
const cities_service_1 = require("../../cities/cities.service");
const create_city_dto_1 = require("../../cities/dto/create-city.dto");
const class_transformer_1 = require("class-transformer");
let CitiesGlossaryProvider = class CitiesGlossaryProvider {
    citiesService;
    code = 'cities_ru';
    constructor(citiesService) {
        this.citiesService = citiesService;
    }
    getMetadata() {
        return Promise.resolve({
            name: 'Города России',
            description: 'Справочник городов РФ из открытых данных',
        });
    }
    findAll(params) {
        return this.citiesService.findAllPaginated(params);
    }
    findOne(id) {
        return this.citiesService.findOneById(id);
    }
    create(data) {
        const dto = (0, class_transformer_1.plainToInstance)(create_city_dto_1.CreateCityDto, data);
        return this.citiesService.create(dto);
    }
};
exports.CitiesGlossaryProvider = CitiesGlossaryProvider;
exports.CitiesGlossaryProvider = CitiesGlossaryProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cities_service_1.CitiesService])
], CitiesGlossaryProvider);
//# sourceMappingURL=cities.glossary-provider.js.map