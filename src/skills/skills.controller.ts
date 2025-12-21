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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import { SkillsService } from './skills.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { TAuthResponse } from '../auth/types';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать навык' })
  @ApiBody({ type: CreateSkillDto })
  @ApiResponse({
    status: 201,
    description: 'Навык успешно создан',
  })
  create(@Req() req: TAuthResponse, @Body() createSkillDto: CreateSkillDto) {
    const ownerId = req.user.sub;
    return this.skillsService.create(ownerId, createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список навыков' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию 1)',
    example: 1,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Размер страницы (по умолчанию 20)',
    example: 20,
    default: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Поиск по названию/категории',
    example: 'Игра на барабанах',
    default: 'Игра на барабанах',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'ID категории или родительской категории',
    example: 'Музыка',
    default: 'Музыка',
  })
  @ApiResponse({
    status: 200,
    description: 'Список навыков с пагинацией',
  })
  findAll(@Query() query: GetSkillsQueryDto) {
    return this.skillsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить навык по id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID навыка',
    example: '11111111-2222-3333-4444-555555555555',
  })
  @ApiResponse({
    status: 200,
    description: 'Навык найден',
  })
  @ApiResponse({
    status: 404,
    description: 'Навык не найден',
  })
  async findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить навык' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID навыка',
    example: '11111111-2222-3333-4444-555555555555',
  })
  @ApiBody({ type: UpdateSkillDto })
  @ApiResponse({
    status: 200,
    description: 'Навык обновлён',
  })
  @ApiResponse({
    status: 403,
    description: 'Попытка обновить чужой навык',
  })
  @ApiResponse({
    status: 404,
    description: 'Навык не найден',
  })
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
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить навык' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID навыка',
    example: '11111111-2222-3333-4444-555555555555',
  })
  @ApiResponse({
    status: 200,
    description: 'Навык удалён',
  })
  @ApiResponse({
    status: 403,
    description: 'Попытка удалить чужой навык',
  })
  @ApiResponse({
    status: 404,
    description: 'Навык не найден',
  })
  async remove(@Param('id') id: string, @Req() req: TAuthResponse) {
    const ownerId = req.user.sub;
    return this.skillsService.remove(ownerId, id);
  }
}
