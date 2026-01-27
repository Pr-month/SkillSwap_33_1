"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_entity_1 = require("./entities/skill.entity");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const user_entity_1 = require("../users/entities/user.entity");
let SkillsService = class SkillsService {
    skillRepository;
    userRepository;
    constructor(skillRepository, userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }
    async create(ownerId, createSkillDto) {
        return this.skillRepository.save({
            title: createSkillDto.title,
            description: createSkillDto.description,
            images: createSkillDto.images || [],
            owner: { id: ownerId },
            category: { id: createSkillDto.category },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 20, search, category } = query;
        const queryBuilder = this.skillRepository
            .createQueryBuilder('skill')
            .leftJoinAndSelect('skill.owner', 'owner')
            .leftJoinAndSelect('skill.category', 'category')
            .leftJoinAndSelect('category.parent', 'parent');
        if (search) {
            queryBuilder.andWhere(`(LOWER(skill.title) LIKE :search
          OR LOWER(category.name) LIKE :search
          OR LOWER(parent.name) LIKE :search)`, { search: `%${search.toLowerCase()}%` });
        }
        if (category) {
            queryBuilder.andWhere('(category.id = :category OR parent.id = :category)', { category });
        }
        const skip = (page - 1) * limit;
        const [data, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        if (page > totalPages && totalPages > 0) {
            throw new common_1.NotFoundException(`Страница ${page} не найдена. Всего страниц: ${totalPages}`);
        }
        return {
            data,
            page,
            totalPages,
        };
    }
    async findOne(id) {
        const skill = await this.skillRepository.findOne({
            where: { id },
            relations: ['owner', 'category', 'category.parent'],
        });
        if (!skill) {
            throw new common_1.NotFoundException(`Skill with id ${id} not found`);
        }
        return skill;
    }
    async update(userId, id, updateSkillDto) {
        const skill = await this.findOne(id);
        if (skill.owner.id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own skills');
        }
        Object.assign(skill, updateSkillDto);
        return this.skillRepository.save(skill);
    }
    async remove(userId, id) {
        const skill = await this.findOne(id);
        if (skill.owner.id !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own skills');
        }
        if (skill.images?.length) {
            for (const image of skill.images) {
                const imagePath = path.join(process.cwd(), image);
                try {
                    await fs.access(imagePath);
                    await fs.unlink(imagePath);
                }
                catch {
                }
            }
        }
        await this.skillRepository.delete(id);
        return { message: 'Навык успешно удалён' };
    }
    async addToFavorite(userId, skillId) {
        const skill = await this.findOne(skillId);
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favoriteSkills'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const favoriteSkills = user.favoriteSkills;
        const alreadyFavorite = favoriteSkills.some((s) => s.id === skillId);
        if (alreadyFavorite) {
            throw new common_1.ConflictException('Навык уже в избранном');
        }
        favoriteSkills.push(skill);
        await this.userRepository.save(user);
        return { message: 'Навык добавлен в избранное' };
    }
    async removeFromFavorite(userId, skillId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favoriteSkills'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const favoriteSkills = user.favoriteSkills;
        const favoriteIndex = favoriteSkills.findIndex((s) => s.id === skillId);
        if (favoriteIndex === -1) {
            throw new common_1.NotFoundException('Навык не найден в избранном');
        }
        favoriteSkills.splice(favoriteIndex, 1);
        await this.userRepository.save(user);
        return { message: 'Навык удалён из избранного' };
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SkillsService);
//# sourceMappingURL=skills.service.js.map