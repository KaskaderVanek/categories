import { ApiProperty } from '@nestjs/swagger/dist'
import { IsString } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty()
  readonly slug: string

  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty({ required: false })
  readonly description?: string

  @ApiProperty({ description: 'Default: true', required: false })
  readonly active?: boolean
}
