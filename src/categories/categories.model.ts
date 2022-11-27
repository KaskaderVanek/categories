import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { UUIDV4 } from 'sequelize'

@Table({ tableName: 'categories', createdAt: false, updatedAt: false })
export class Category extends Model<Category> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: UUIDV4,
  })
  id: string

  @ApiProperty({
    example: 'products',
    description: 'Уникальное название на англ. в системе',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  slug: string

  @ApiProperty({
    example: 'Продукты',
    description: 'Название категории. Англ., кириллица',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string

  @ApiProperty({
    example: 'Категория продуктов',
    description: 'Описание категории. Англ., кириллица',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string

  @ApiProperty({
    example: new Date(),
    description: 'Дата создания, проставляется автоматически',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdDate: Date

  @ApiProperty({ example: true, description: 'Статус категории' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active: boolean
}
