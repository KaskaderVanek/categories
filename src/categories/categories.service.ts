import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './categories.model'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { isUUID, matches } from 'class-validator'
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
    if (findUniqueCategory && id !== findUniqueCategory.id) {
      throw new HttpException(`Категория с названием '${dto.slug}' уже существует`, HttpStatus.BAD_REQUEST)
    }

    return category.update(dto)
  }

  async getOne(identity: string): Promise<Category> {
    
    if (isUUID(identity, '4')) {
      const category = await this.categoryModel.findByPk(identity)
      if (!category) throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
      return category
    } else {

      if (!matches(identity, new RegExp('^[a-zA-Z0-9_-]*$'))) {
        throw new HttpException('Slug должен быть строкой и не содержать кириллицу', HttpStatus.BAD_REQUEST)
      }

      const category = await this.categoryModel.findOne({
        where: { slug: identity },
      })
      if (!category) throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
      return category
    }

  }

  async delete(id: string): Promise<void> {
    const deleted = await this.categoryModel.destroy({ where: { id: id } })
    if (!deleted) {
      throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
    }
  }

  filter(dto: FilterCategory): Promise<{ rows: Category[], count: number }> {
    const { active, page, pageSize, name, description, search, sort } = dto
    const sortAtt: string[] = Object.keys(Category.getAttributes())
    const findOptions: FindOptions<Category> = {
      order: [],
      where: { [Op.and]: [{}] },
      limit: pageSize,
    }

    if (page) findOptions.offset = page * pageSize - pageSize
    if (active) findOptions.where[Op.and][0].active = active

    if (search) {
      findOptions.where[Op.or] = [where(col('name'), '~*', `${search}`), where(col('description'), '~*', `${search}`)]
    } else {
      if (name) {
        findOptions.where[Op.and][0].name = where(col('name'), '~*', `${name}`)
      }
      if (description) {
        findOptions.where[Op.and][0].description = where(col('description'), '~*', `${description}`)
      }
    }

    if (sort) {
      if (sortAtt.includes(sort) || sortAtt.includes(sort.slice(1))) {
        if (sort.startsWith('-')) findOptions.order[0] = [sort.slice(1), 'DESC']
        if (!sort.startsWith('-')) findOptions.order[0] = [sort, 'ASC']
      } else {
        throw new HttpException('Сортировка возможна толька по полям модели Категории', HttpStatus.BAD_REQUEST)
      } 
    }

    return this.categoryModel.findAndCountAll(findOptions)
  }

  getAll(): Promise<Category[]> {
    return this.categoryModel.findAll()
  }
}
