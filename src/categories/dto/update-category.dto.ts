import { ApiProperty } from '@nestjs/swagger/dist'

export class UpdateCategoryDto {
  @ApiProperty({ required: true })
  readonly id: string

  @ApiProperty({ required: false })
  readonly slug?: string

  @ApiProperty({ required: false })
  readonly name?: string

  @ApiProperty({ required: false })
  readonly description?: string

  @ApiProperty({ required: false })
  readonly createdDate?: Date

  @ApiProperty({ required: false })
  readonly active?: boolean
}
