import { ApiProperty } from '@nestjs/swagger'
import { Transform,  } from 'class-transformer'
import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class FilterCategory {
  @ApiProperty({ required: false })
  @IsString()
  readonly name?: string

  @ApiProperty({ required: false })
  @IsString()
  readonly description?: string

  @ApiProperty({ required: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  readonly active?: boolean

  @ApiProperty({ required: false })
  @IsString()
  readonly search?: string

  @ApiProperty({ required: false })
  @Transform(({ value }) => toNumber(value, { min: 1, max: 9, default: 2 }))
  @IsNumber()
  readonly pageSize?: number = 2

  @ApiProperty({ required: false })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly page?: number

  @ApiProperty({ required: false })
  @IsString()
  readonly sort?: string = '-createdDate'
}

const toBoolean = (value: string): boolean => {
  value = value.toLowerCase()
  if (value === 'true' || value === '1') return true
  if (value === 'false' || value === '0') return false
  return undefined
}

interface ToNumberOptions {
  default?: number
  min?: number
  max?: number
}
const toNumber = (value: string, opts?: ToNumberOptions): number => {
  let newValue = Number.parseInt(value || String(opts.default), 10)
  if (Number.isNaN(newValue)) newValue = opts.default
  if (newValue < opts?.min) newValue = opts.min
  if (newValue > opts?.max) newValue = opts.max
  return newValue
}
