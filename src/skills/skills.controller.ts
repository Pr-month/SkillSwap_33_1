import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';

//TODO: добавить гарды авторизации
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Req() req: { user: string }, @Body() createSkillDto: CreateSkillDto) {
    const ownerId = req.user;
    return this.skillsService.create(ownerId, createSkillDto);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: { user: string },
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    const ownerId = req.user;
    return this.skillsService.update(ownerId, id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: string }) {
    const ownerId = req.user;
    return this.skillsService.remove(ownerId, id);
  }
}
