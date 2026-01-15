import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import {
  ApiCreateCategory,
  ApiDeleteCategory,
  ApiGetAllCategories,
  ApiGetCategoryById,
  ApiUpdateCategory,
} from './categories.swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('categories')
@UseGuards(AccessTokenGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreateCategory()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiGetAllCategories()
  @Public()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiGetCategoryById()
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateCategory()
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiDeleteCategory()
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
