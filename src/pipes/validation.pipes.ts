import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private isPrimitive(type: any): type is StringConstructor | BooleanConstructor | NumberConstructor {
    const types = [String, Boolean, Number];
    return types.includes(type);
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype || this.isPrimitive(metadata.metatype)) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length) {
      let messages = errors.map(error => {
        return `${error.property} - ${Object.values(error.constraints).join(',')}`;
      });
      throw new ValidationException(messages);
    }
    return value;
  }
}
