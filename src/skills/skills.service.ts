import {
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

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async create(
    ownerId: string,
    createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    const skill = this.skillRepository.create({
      ...createSkillDto,
      ownerId,
    });
    return this.skillRepository.save(skill);
  }

  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: GetSkillsQueryDto,
  ): Promise<Skill[]> {
    // TODO: реализовать пагинацию
    return this.skillRepository.find();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOneBy({ id });
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
    if (skill.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own skills');
    }
    Object.assign(skill, updateSkillDto);
    return this.skillRepository.save(skill);
  }

  async remove(userId: string, id: string): Promise<void> {
    const skill = await this.findOne(id);

    if (skill.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own skills');
    }

    if (skill.image) {
      const imagePath = path.join(process.cwd(), skill.image);
      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch {
        // Игнорируем ошибку удаления файла
      }
    }

    await this.skillRepository.delete(id);
  }
}
