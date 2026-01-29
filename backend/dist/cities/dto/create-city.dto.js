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
exports.CreateCityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCityDto {
    name;
    population;
}
exports.CreateCityDto = CreateCityDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Название должно быть строкой' }),
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email пользователя',
    }),
    __metadata("design:type", String)
], CreateCityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email пользователя',
    }),
    (0, class_validator_1.IsInt)({ message: 'Население должно быть целым числом' }),
    __metadata("design:type", Number)
], CreateCityDto.prototype, "population", void 0);
//# sourceMappingURL=create-city.dto.js.map