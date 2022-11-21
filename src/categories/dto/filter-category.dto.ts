import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class FilterCategory {
  @ApiProperty({ required: false })
  readonly name?: string

  @ApiProperty({ required: false })
  readonly description?: string

  @ApiProperty({ required: false })
  @Transform(({ value }) => toBoolean(value))
  readonly active?: boolean

  @ApiProperty({ required: false })
  readonly search?: string

  @ApiProperty({ required: false })
  @Transform(({ value }) => toNumber(value, { min: 1, max: 9, default: 2 }))
  @IsNumber()
  readonly pageSize?: number

  @ApiProperty({ required: false })
  @Transform(({ value }) => Number(value))
  readonly page?: number

  @ApiProperty({ required: false })
  @Transform(({ value }) => Number(value))
  readonly sort?: number
}

const toBoolean = (value: string): boolean => {
  value = value.toLowerCase()
  return value === 'true' || value === '1' ? true : false
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
