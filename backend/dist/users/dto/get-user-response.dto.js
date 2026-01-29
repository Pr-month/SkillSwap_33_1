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
exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const users_enums_1 = require("../users.enums");
const roles_enum_1 = require("../../auth/roles.enum");
class UserResponseDto {
    id;
    name;
    email;
    about;
    birthdate;
    city;
    gender;
    avatar;
    role;
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '11111111-2222-3333-4444-555555555555',
        description: 'ID пользователя',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Иван Иванов',
        description: 'Имя пользователя',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email пользователя',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Некорректный email' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Backend-разработчик из Москвы',
        description: 'Информация о пользователе',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1990-01-01T00:00:00.000Z',
        description: 'Дата рождения пользователя в формате ISO',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Неверный формат даты рождения' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "birthdate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Москва',
        description: 'Город проживания',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "city", void 0);
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
], UserResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/avatar.jpg',
        description: 'URL аватара пользователя',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Некорректный URL аватара' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: roles_enum_1.UserRole.USER,
        description: 'Роль пользователя в системе',
        enum: roles_enum_1.UserRole,
        enumName: 'UserRole',
    }),
    (0, class_validator_1.IsEnum)(roles_enum_1.UserRole, { message: 'Недопустимая роль пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
//# sourceMappingURL=get-user-response.dto.js.map