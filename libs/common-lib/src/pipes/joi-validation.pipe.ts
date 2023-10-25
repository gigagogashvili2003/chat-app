import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly joiSchema: Joi.Schema) {}

  transform(value: any) {
    const result = this.joiSchema.validate(value);

    if (result.error) {
      throw new BadRequestException(result.error.details);
    }

    return value;
  }
}
