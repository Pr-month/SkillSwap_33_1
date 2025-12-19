import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(ownerId: string, createSkillDto: CreateSkillDto) {
    const createdSkill = await this.skillsRepository.save({
      title: createSkillDto.title,
      description: createSkillDto.description,
      category: createSkillDto.category,
      images: createSkillDto.images,
      owner: { id: ownerId },
    });

    return createdSkill;
  }

  findAll() {
    return `This action returns all skills`;
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
