import { HttpException, HttpStatus } from "@nestjs/common"
import { ValidateIf } from "class-validator"

export function IsNotUndefined(property: string): PropertyDecorator {
  return ValidateIf((_, value) => {
    if (value === undefined) {
      throw new HttpException(
        `Поле ${property} обязательно для категории`,
        HttpStatus.BAD_REQUEST,
      )
    }
    return true
  })
}
