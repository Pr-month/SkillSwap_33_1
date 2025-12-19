import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async findAll(query: GetSkillsQueryDto) {
    const { page = 1, limit = 20, search, category } = query;
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
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

  create(ownerId: string, createSkillDto: CreateSkillDto) {
    return `This action adds a new skill ${createSkillDto.title} for owner ${ownerId}`;
  }

  findOne(id: string) {
    return `This action returns a #${id} skill`;
  }

  async update(userId: string, id: string, updateSkillDto: UpdateSkillDto) {
    const skill = await this.skillRepository.findOne({ where: { id } });

    if (!skill) {
      throw new NotFoundException(`Навык с ID ${id} не найден`);
    }

    if (skill.owner !== userId) {
      throw new ForbiddenException('Вы можете обновлять только свои навыки');
    }

    Object.assign(skill, updateSkillDto);
    return this.skillRepository.save(skill);
  }

  remove(ownerId: string, id: string) {
    return `This action removes a #${id} skill for ${ownerId}`;
  }
}
