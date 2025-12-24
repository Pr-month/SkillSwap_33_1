import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    ownerId: string,
    createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    return this.skillRepository.save({
      title: createSkillDto.title,
      description: createSkillDto.description,
      images: createSkillDto.images || [],
      owner: { id: ownerId },
      category: { id: createSkillDto.category },
    });
  }

  async findAll(query: GetSkillsQueryDto) {
    const { page = 1, limit = 20, search, category } = query;
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.owner', 'owner')
      .leftJoinAndSelect('skill.category', 'category')
      .leftJoinAndSelect('category.parent', 'parent');

    if (search) {
      queryBuilder.andWhere(
        `(LOWER(skill.title) LIKE :search
          OR LOWER(category.name) LIKE :search
          OR LOWER(parent.name) LIKE :search)`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere(
        '(category.id = :category OR parent.id = :category)',
        { category },
      );
    }

    const skip = (page - 1) * limit;
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    if (page > totalPages && totalPages > 0) {
      throw new NotFoundException(
        `Страница ${page} не найдена. Всего страниц: ${totalPages}`,
      );
    }

    return {
      data,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id },
      relations: ['owner', 'category', 'category.parent'],
    });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return skill;
  }

  async update(
    userId: string,
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    const skill = await this.findOne(id);
    if (skill.owner.id !== userId) {
      throw new ForbiddenException('You can only update your own skills');
    }
    Object.assign(skill, updateSkillDto);
    return this.skillRepository.save(skill);
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const skill = await this.findOne(id);
    if (skill.owner.id !== userId) {
      throw new ForbiddenException('You can only delete your own skills');
    }

    if (skill.images?.length) {
      for (const image of skill.images) {
        const imagePath = path.join(process.cwd(), image);
        try {
          await fs.access(imagePath);
          await fs.unlink(imagePath);
        } catch {
          // Файл уже удалён или не существует — игнорируем
        }
      }
    }

    await this.skillRepository.delete(id);
    return { message: 'Навык успешно удалён' };
  }

  async addToFavorite(
    userId: string,
    skillId: string,
  ): Promise<{ message: string }> {
    const skill = await this.findOne(skillId);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteSkills'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const alreadyFavorite = user.favoriteSkills.some((s) => s.id === skillId);
    if (alreadyFavorite) {
      throw new ConflictException('Навык уже в избранном');
    }

    user.favoriteSkills.push(skill);
    await this.userRepository.save(user);

    return { message: 'Навык добавлен в избранное' };
  }

  async removeFromFavorite(
    userId: string,
    skillId: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteSkills'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const favoriteIndex = user.favoriteSkills.findIndex(
      (s) => s.id === skillId,
    );
    if (favoriteIndex === -1) {
      throw new NotFoundException('Навык не найден в избранном');
    }

    user.favoriteSkills.splice(favoriteIndex, 1);
    await this.userRepository.save(user);

    return { message: 'Навык удалён из избранного' };
  }
}
