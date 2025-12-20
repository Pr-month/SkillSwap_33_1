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
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { TAuthResponse } from '../auth/types';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Req() req: TAuthResponse, @Body() createSkillDto: CreateSkillDto) {
    const ownerId = req.user.sub;
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
  @UseGuards(AccessTokenGuard)
  update(
    @Param('id') id: string,
    @Req() req: TAuthResponse,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    const ownerId = req.user.sub;
    return this.skillsService.update(ownerId, id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @Req() req: TAuthResponse) {
    const ownerId = req.user.sub;
    return this.skillsService.remove(ownerId, id);
  }
}
