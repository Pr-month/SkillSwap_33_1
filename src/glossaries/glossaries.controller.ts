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

@ApiTags('Glossaries')
@Controller('v1/glossaries')
export class GlossariesController {
  constructor(private readonly glossariesService: GlossariesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all glossaries' })
  @ApiResponse({ status: 200, description: 'Glossaries list' })
  async findAll() {
    return this.glossariesService.getAllGlossaries();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get glossary metadata by code' })
  @ApiParam({ name: 'code', required: true })
  @ApiResponse({ status: 200, description: 'Glossary metadata' })
  @ApiResponse({ status: 404, description: 'Glossary not found' })
  async findByCode(@Param('code') code: string) {
    const glossary = await this.glossariesService.getGlossaryMetadata(code);
    if (!glossary) throw new NotFoundException(`Glossary '${code}' not found`);
    return glossary;
  }

  @Get(':code/items')
  @ApiOperation({ summary: 'Get glossary items with pagination' })
  @ApiParam({ name: 'code', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Paginated items' })
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
  @ApiOperation({ summary: 'Get single glossary item by ID' })
  @ApiParam({ name: 'code', required: true })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Glossary item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(
    @Param('code') code: string,
    @Param('id') id: string,
  ): Promise<unknown> {
    const item = await this.glossariesService.getItem(code, id);
    if (!item) {
      throw new NotFoundException(
        `Item '${id}' not found in glossary '${code}'`,
      );
    }
    return item;
  }
}
