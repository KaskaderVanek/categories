import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Param,
  Query,
  Put,
  ValidationPipe,
  HttpException,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger/dist'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './categories.model'
import { CategoriesService } from './categories.service'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { UuidValidationPipe } from 'src/pipes/uuid-validation.pipe'
import { FilterCategory } from './dto/filter-category.dto'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @ApiOperation({ summary: 'Создать категорию' })
  @ApiResponse({ status: 201, type: Category })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCategory(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    dto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(dto)
  }

  @ApiOperation({ summary: 'Изменить категорию' })
  @ApiResponse({ status: 200 })
  @Put(':id')
  updateCategory(
    @Param('id', UuidValidationPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, dto)
  }


  @ApiOperation({ summary: 'Получить массив категорий по фильтру' })
  @ApiResponse({ status: 200 })
  @Get('')
  filterCategory(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        skipUndefinedProperties: true,
      }),
    )
    dto: FilterCategory,
  ) {
    return this.categoryService.filter(dto)
  }

  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, type: [Category] })
  @Get('all')
  getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAll()
  }

  @ApiOperation({
    summary: 'Получить категорию по Id или Slug',
    description: 'В поле {identity} нужно передать id или slug',
  })
  @ApiParam({ name: 'identity', example: 'a954927f-2ac6-4b9d-8486-03c0e8616ff3' })
  @ApiResponse({ status: 200, type: Category })
  @Get(':identity')
  getByIdOrSlug(@Param('identity') identity: string): Promise<Category> {
    return this.categoryService.getOne(identity)
  }

  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCategory(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    return this.categoryService.delete(id)
  }
}
