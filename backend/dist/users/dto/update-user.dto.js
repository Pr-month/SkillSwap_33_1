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
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const users_enums_1 = require("../users.enums");
class UpdateUserDto {
    name;
    about;
    birthdate;
    city;
    gender;
    avatar;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Иван Иванов',
        description: 'Имя пользователя (2–50 символов)',
        minLength: 2,
        maxLength: 50,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50, { message: 'Ваше имя должно быть от 2 до 50 символов' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Backend-разработчик из Москвы',
        description: 'Информация о пользователе (до 1000 символов)',
        maxLength: 1000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 1000, {
        message: 'Информация о себе не должна превышать 1000 символов',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1990-01-01',
        description: 'Дата рождения в формате ISO (YYYY-MM-DD)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Неверный формат даты рождения' }),
    __metadata("design:type", Date)
], UpdateUserDto.prototype, "birthdate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Москва',
        description: 'Город проживания',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: users_enums_1.Gender.MALE,
        description: 'Пол пользователя',
        enum: users_enums_1.Gender,
        enumName: 'Gender',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enums_1.Gender, { message: 'gender должен быть одним из: MALE/FEMALE' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/avatar.jpg',
        description: 'URL аватара пользователя',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "avatar", void 0);
//# sourceMappingURL=update-user.dto.js.map