import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

export class FilterCategory {

  @ApiProperty({ required: false })
  readonly name?: string
  
  @ApiProperty({ required: false })
  readonly description?: string
  
  @ApiProperty({ required: false })
  @Transform(() => Boolean)
  readonly active?: boolean

  @ApiProperty({ required: false })
  readonly search?: string

  @ApiProperty({ required: false })
  @Transform(({value}) => Number(value))
  readonly pageSize?: number

  @ApiProperty({ required: false })
  @Transform(({value}) => Number(value))
  readonly page?: number

  @ApiProperty({ required: false })
  @Transform(({value}) => Number(value))
  readonly sort?: number
}
