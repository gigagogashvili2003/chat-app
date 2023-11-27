import { HttpStatus } from '@nestjs/common';
import { SuccessMessages } from '../enums';

export interface GenericResponse<B = null> {
  message: SuccessMessages | string;
  status: HttpStatus;
  body?: B;
}
