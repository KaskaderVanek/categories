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
  UsePipes,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './categories.model'
import { CategoriesService } from './categories.service'
import { UpdateCategoryDto } from './dto/update-category.dto'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @ApiOperation({ summary: 'Создать категорию' })
  @ApiResponse({ status: 201, type: Category })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCategory(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    dto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(dto)
  }

  @ApiOperation({ summary: 'Изменить категорию' })
  @ApiResponse({ status: 200 })
  @Put(':id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto)
  }

  @ApiOperation({ summary: 'Получить категорию по Id или Slug', description: 'В поле {value} нужно передать id или slug' })
  @ApiParam({name: 'value', example: 'a954927f-2ac6-4b9d-8486-03c0e8616ff3'})
  @ApiResponse({ status: 200, type: Category, })
  @Get(':value')
  getByIdOrSlug(@Param('value') value: string): Promise<Category> {
    return this.categoryService.getOne(value)
  }

  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.delete(id)
  }

  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, type: [Category] })
  @Get('all')
  getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAll()
  }
}
