import { Injectable, NotFoundException } from '@nestjs/common';
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

  update(ownerId: string, id: string, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill with ${JSON.stringify(updateSkillDto)} for ${ownerId}`;
  }

  remove(ownerId: string, id: string) {
    return `This action removes a #${id} skill for ${ownerId}`;
  }
}
