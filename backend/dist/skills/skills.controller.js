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
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const update_skill_dto_1 = require("./dto/update-skill.dto");
const get_skills_query_dto_1 = require("./dto/get-skills-query.dto");
const skills_service_1 = require("./skills.service");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const skills_swagger_1 = require("./skills.swagger");
let SkillsController = class SkillsController {
    skillsService;
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    create(req, createSkillDto) {
        const ownerId = req.user.sub;
        return this.skillsService.create(ownerId, createSkillDto);
    }
    findAll(query) {
        return this.skillsService.findAll(query);
    }
    async findOne(id) {
        return this.skillsService.findOne(id);
    }
    update(id, req, updateSkillDto) {
        const userId = req.user.sub;
        return this.skillsService.update(userId, id, updateSkillDto);
    }
    async remove(id, req) {
        const ownerId = req.user.sub;
        return this.skillsService.remove(ownerId, id);
    }
    addToFavorite(id, req) {
        const userId = req.user.sub;
        return this.skillsService.addToFavorite(userId, id);
    }
    removeFromFavorite(id, req) {
        const userId = req.user.sub;
        return this.skillsService.removeFromFavorite(userId, id);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, skills_swagger_1.ApiCreateSkill)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_skill_dto_1.CreateSkillDto]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "create", null);
__decorate([
    (0, skills_swagger_1.ApiGetSkills)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_skills_query_dto_1.GetSkillsQueryDto]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "findAll", null);
__decorate([
    (0, skills_swagger_1.ApiGetSkill)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, skills_swagger_1.ApiUpdateSkill)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_skill_dto_1.UpdateSkillDto]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, skills_swagger_1.ApiDeleteSkill)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, skills_swagger_1.ApiAddToFavorite)(),
    (0, common_1.Post)(':id/favorite'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "addToFavorite", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, skills_swagger_1.ApiRemoveFromFavorite)(),
    (0, common_1.Delete)(':id/favorite'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "removeFromFavorite", null);
exports.SkillsController = SkillsController = __decorate([
    (0, swagger_1.ApiTags)('Skills'),
    (0, common_1.Controller)('skills'),
    __metadata("design:paramtypes", [skills_service_1.SkillsService])
], SkillsController);
//# sourceMappingURL=skills.controller.js.map