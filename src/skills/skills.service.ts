import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  create(ownerId: string, createSkillDto: CreateSkillDto) {
    return `This action adds a new skill ${createSkillDto.title} for owner ${ownerId}`;
  }

  findAll() {
    return `This action returns all skills`;
  }

  findOne(id: string) {
    return `This action returns a #${id} skill`;
  }

  update(ownerId: string, id: string, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill ${updateSkillDto.title} if owner is ${ownerId}`;
  }

  remove(ownerId: string, id: string) {
    return `This action removes a #${id} skill if owner is ${ownerId}`;
  }
}
