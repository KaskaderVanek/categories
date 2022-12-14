import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { isUUID } from 'class-validator'

@Injectable()
export class UuidValidationPipe implements PipeTransform<any> {
  transform(value: any) {
    if (!isUUID(value, '4')) throw new HttpException('id должен быть типа UUIDv4', HttpStatus.BAD_REQUEST)
    return value
  }
}
