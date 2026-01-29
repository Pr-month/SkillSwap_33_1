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
exports.CreateSkillDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSkillDto {
    title;
    description;
    category;
    images = [];
}
exports.CreateSkillDto = CreateSkillDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Игра на барабанах',
        description: 'Название навыка',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, {
        message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
    }),
    (0, class_validator_1.MaxLength)(50, {
        message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
    }),
    __metadata("design:type", String)
], CreateSkillDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Игра на барабанах',
        description: 'Подробное описание навыка',
        minLength: 2,
        maxLength: 1000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, {
        message: 'Description is too long. Maximal length is $constraint1 characters, but actual is $value',
    }),
    (0, class_validator_1.MaxLength)(1000, {
        message: 'Description is too long. Maximal length is $constraint1 characters, but actual is $value',
    }),
    __metadata("design:type", String)
], CreateSkillDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '11111111-2222-3333-4444-555555555555',
        description: 'ID категории (UUID)',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSkillDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ['http://localhost:3000/public/images/skills/drums-1.png'],
        description: 'Массив URL картинок (до 10 штук)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    (0, class_validator_1.ArrayMaxSize)(10),
    __metadata("design:type", Array)
], CreateSkillDto.prototype, "images", void 0);
//# sourceMappingURL=create-skill.dto.js.map