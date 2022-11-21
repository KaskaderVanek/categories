import { ApiProperty } from '@nestjs/swagger/dist'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class UpdateCategoryDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches('^[a-zA-Z0-9_]*$', '', {
    message: 'Slug должен быть строкой и не содержать кириллицу',
  })
  @IsNotEmpty({ message: 'Slug не может быть пустым' })
  readonly slug?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Name должен быть строкой' })
  @IsNotEmpty({ message: 'Name не может быть пустым' })
  readonly name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Description должен быть строкой' })
  readonly description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({ message: 'Active должен быть типа Boolean' })
  readonly active?: boolean
}
