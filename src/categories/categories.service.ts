import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './categories.model'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { isUUID } from 'class-validator'

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const [category, created] = await this.categoryModel.findOrCreate({
      where: { slug: dto.slug },
      defaults: dto,
    })
    if (!created)
      throw new HttpException(
        `Категория '${dto.slug}' уже существует`,
        HttpStatus.BAD_REQUEST,
      )
    return category
  }

  async update(dto: UpdateCategoryDto) {
    if (!dto.id || !isUUID(dto.id, '4'))
      throw new HttpException('Неверный id', HttpStatus.BAD_REQUEST)
    const category = await this.categoryModel.findByPk(dto.id)
    if (!category)
      throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
    return await category.update(dto)
  }

  async getOne(query) {
    console.log(query)

    return query
  }

  async delete(id: string) {
    return await this.categoryModel.destroy({ where: { id: id } })
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryModel.findAll()
  }
}
