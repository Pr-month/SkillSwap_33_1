import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

//TODO: добавить гарды авторизации
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Req() req: { user: string }, @Body() createSkillDto: CreateSkillDto) {
    const ownerId = req.user;
    return this.skillsService.create(ownerId, createSkillDto);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Req() req: { user: string },
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    const ownerId = req.user;
    return this.skillsService.update(ownerId, id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: { user: string }) {
    const ownerId = req.user;
    return this.skillsService.remove(ownerId, id);
  }
}
