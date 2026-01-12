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
import { ApiTags } from '@nestjs/swagger';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import { SkillsService } from './skills.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { TAuthResponse } from '../auth/types';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiCreateSkill,
  ApiGetSkills,
  ApiGetSkill,
  ApiUpdateSkill,
  ApiDeleteSkill,
  ApiAddToFavorite,
  ApiRemoveFromFavorite,
} from './skills.swagger';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @ApiCreateSkill()
  @Post()
  create(@Req() req: TAuthResponse, @Body() createSkillDto: CreateSkillDto) {
    const ownerId = req.user.sub;
    return this.skillsService.create(ownerId, createSkillDto);
  }

  @ApiGetSkills()
  @Get()
  findAll(@Query() query: GetSkillsQueryDto) {
    return this.skillsService.findAll(query);
  }

  @ApiGetSkill()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @ApiUpdateSkill()
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
  @UseGuards(RolesGuard)
  @ApiDeleteSkill()
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: TAuthResponse) {
    const ownerId = req.user.sub;
    return this.skillsService.remove(ownerId, id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiAddToFavorite()
  @Post(':id/favorite')
  addToFavorite(@Param('id') id: string, @Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.skillsService.addToFavorite(userId, id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiRemoveFromFavorite()
  @Delete(':id/favorite')
  removeFromFavorite(@Param('id') id: string, @Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.skillsService.removeFromFavorite(userId, id);
  }
}
