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

  async update(id: string, dto: UpdateCategoryDto) {
    if (!id || !isUUID(id, '4'))
      throw new HttpException('Неверный id', HttpStatus.BAD_REQUEST)
    const category = await this.categoryModel.findByPk(id)
    if (!category)
      throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
    return await category.update(dto)
  }

  async getOne(value: string): Promise<Category> {
    if (isUUID(value, '4')) {
      const category = await this.categoryModel.findByPk(value)
      if (!category) {
        throw new NotFoundException('Категория не найдена')
      }
      return category
    } else {
      const category = await this.categoryModel.findOne({where: {slug: value}})
      if (!category) {
        throw new NotFoundException('Категория не найдена')
      }
      return category
    }
  }

  async delete(id: string) {
    return await this.categoryModel.destroy({ where: { id: id } })
  }

  async filter() {
    // https://tkssharma.com/nestjs-playing-with-query-param-dto/
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryModel.findAll()
  }
}
