import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './categories.model'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { isUUID } from 'class-validator'
import { FilterCategory } from './dto/filter-category.dto'
import { FindOptions, Op, where, col } from 'sequelize'

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const [category, created] = await this.categoryModel.findOrCreate({
      where: { slug: dto.slug },
      defaults: {...dto, createdDate: new Date()},
    })
    if (!created) throw new HttpException(`Категория '${dto.slug}' уже существует`, HttpStatus.BAD_REQUEST)

    return category
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findByPk(id)
    if (!category) throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
    const findUniqueCategory = dto.slug ? await this.categoryModel.findOne({ where: { slug: dto?.slug } }) : null
    if (findUniqueCategory && id !== findUniqueCategory.id)
      throw new HttpException(`Категория с названием '${dto.slug}' уже существует`, HttpStatus.BAD_REQUEST)
    return await category.update(dto)
  }

  async getOne(value: string): Promise<Category> {
    if (isUUID(value, '4')) {
      const category = await this.categoryModel.findByPk(value)
      if (!category) throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
      return category
    } else {
      const category = await this.categoryModel.findOne({
        where: { slug: value },
      })
      if (!category) throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
      return category
    }
  }

  async delete(id: string): Promise<HttpException> {
    const deleted = await this.categoryModel.destroy({ where: { id: id } })
    if (deleted) {
      throw new HttpException('Категория удалена', HttpStatus.OK)
    } else {
      throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
    }
  }

  async filter(dto: FilterCategory) {
    const { active, page, pageSize, name, description, search, sort } = dto
    const sortAtt: Array<string> = Object.keys(Category.getAttributes())
    const findOptions: FindOptions<Category> = {
      order: [],
      where: { [Op.and]: [{}] },
      limit: pageSize,
    }
    if (page) findOptions.offset = page * pageSize - pageSize
    if (active !== undefined) findOptions.where[Op.and][0].active = active
    if (name && !search) findOptions.where[Op.and][0].name = where(col('name'), '~*', `${name}`)
    if (description && !search) {
      findOptions.where[Op.and][0].description = where(col('description'), '~*', `${description}`)
    }
    if (search) {
      findOptions.where[Op.or] = [where(col('name'), '~*', `${search}`), where(col('description'), '~*', `${search}`)]
    }
    if (sort) {
      if (sort.startsWith('-') && sortAtt.includes(sort.slice(1))) findOptions.order[0] = [sort.slice(1), 'DESC']
      if (!sort.startsWith('-') && sortAtt.includes(sort)) findOptions.order[0] = [sort, 'ASC']
    }
    const categories = await this.categoryModel.findAll(findOptions)

    return categories
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryModel.findAll()
  }
}
