import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import { SkillsService } from './skills.service';
import { TAuthResponse } from '../auth/types';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req: TAuthResponse, @Body() createSkillDto: CreateSkillDto) {
    const ownerId = req.user.sub;
    return this.skillsService.create(ownerId, createSkillDto);
  }

  @Get()
  findAll(@Query() query: GetSkillsQueryDto) {
    return this.skillsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: TAuthResponse,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    const userId = req.user.sub;
    return this.skillsService.update(userId, id, updateSkillDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.skillsService.remove(userId, id);
  }
}
