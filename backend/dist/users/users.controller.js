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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_enum_1 = require("../auth/roles.enum");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_service_1 = require("./users.service");
const users_swagger_1 = require("./users.swagger");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getMe(req) {
        const userId = req.user.sub;
        return this.usersService.findOne(userId);
    }
    updateMe(req, updateUserDto) {
        const userId = req.user.sub;
        if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
            throw new common_1.BadRequestException('Update data is required');
        }
        return this.usersService.update(userId, updateUserDto);
    }
    updatePassword(req, updatePasswordDto) {
        const userId = req.user.sub;
        return this.usersService.updatePassword(userId, updatePasswordDto);
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll() {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.USER, roles_enum_1.UserRole.ADMIN),
    (0, common_1.Get)('me'),
    (0, users_swagger_1.ApiGetMe)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.USER, roles_enum_1.UserRole.ADMIN),
    (0, common_1.Patch)('me'),
    (0, users_swagger_1.ApiPatchMe)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.USER, roles_enum_1.UserRole.ADMIN),
    (0, common_1.Patch)('me/password'),
    (0, users_swagger_1.ApiUpdatePassword)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.ADMIN),
    (0, common_1.Post)(),
    (0, users_swagger_1.ApiCreateUser)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.USER, roles_enum_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    (0, users_swagger_1.ApiFindAllUsers)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.ADMIN),
    (0, common_1.Get)(':id'),
    (0, users_swagger_1.ApiFindOne)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id'),
    (0, users_swagger_1.ApiUpdateUser)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    (0, users_swagger_1.ApiRemoveUser)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map