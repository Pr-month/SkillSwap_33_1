import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { GlossariesService } from './glossaries.service';
import {
  ApiGetAllGlossaries,
  ApiGetGlossaryByCode,
  ApiGetGlossaryItems,
  ApiGetGlossaryItemById,
} from './glossaries.swagger';

@Controller('v1/glossaries')
export class GlossariesController {
  constructor(private readonly glossariesService: GlossariesService) {}

  @Get()
  @ApiGetAllGlossaries()
  async findAll() {
    return this.glossariesService.getAllGlossaries();
  }

  @Get(':code')
  @ApiGetGlossaryByCode()
  async findByCode(@Param('code') code: string) {
    const glossary = await this.glossariesService.getGlossaryMetadata(code);
    if (!glossary)
      throw new NotFoundException(`Справочник '${code}' не найден`);
    return glossary;
  }

  @Get(':code/items')
  @ApiGetGlossaryItems()
  async findItems(
    @Param('code') code: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('search') search = '',
  ) {
    const { items, total } = await this.glossariesService.getItems(
      code,
      page,
      limit,
      search,
    );

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get(':code/items/:id')
  @ApiGetGlossaryItemById()
  async findOne(
    @Param('code') code: string,
    @Param('id') id: string,
  ): Promise<unknown> {
    const item = await this.glossariesService.getItem(code, id);
    if (!item) {
      throw new NotFoundException(
        `Элемент справочника с ID '${id}' не найден в справочнике '${code}'`,
      );
    }
    return item;
  }
}
/*
import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { GlossariesService } from './glossaries.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Справочники')
@Controller('v1/glossaries')
export class GlossariesController {
  constructor(private readonly glossariesService: GlossariesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех справочников' })
  @ApiResponse({ status: 200, description: 'Список справочников' })
  async findAll() {
    return this.glossariesService.getAllGlossaries();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Получить метаданные справочника по коду' })
  @ApiParam({ name: 'code', required: true })
  @ApiResponse({ status: 200, description: 'Метаданные справочника' })
  @ApiResponse({ status: 404, description: 'Справочник не найден' })
  async findByCode(@Param('code') code: string) {
    const glossary = await this.glossariesService.getGlossaryMetadata(code);
    if (!glossary) throw new NotFoundException(`Справочник '${code}' не найден`);
    return glossary;
  }

  @Get(':code/items')
  @ApiOperation({ summary: 'Получить элементы справочника с пагинацией' })
  @ApiParam({ name: 'code', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Элементы справочника с информацией о пагинации' })
  async findItems(
    @Param('code') code: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('search') search = '',
  ) {
    const { items, total } = await this.glossariesService.getItems(
      code,
      page,
      limit,
      search,
    );

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get(':code/items/:id')
  @ApiOperation({ summary: 'Получить один элемент справочника по ID' })
  @ApiParam({ name: 'code', required: true })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Элемент справочника' })
  @ApiResponse({ status: 404, description: 'Элемент справочника не найден' })
  async findOne(
    @Param('code') code: string,
    @Param('id') id: string,
  ): Promise<unknown> {
    const item = await this.glossariesService.getItem(code, id);
    if (!item) {
      throw new NotFoundException(
        `Элемент справочника с '${id}' не найден в справочнике '${code}'`,
      );
    }
    return item;
  }
}
*/
