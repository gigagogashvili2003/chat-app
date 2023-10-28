import { HttpStatus } from '@nestjs/common';
import { SuccessMessages } from '../enums';

export interface GenericResponse<M, B, S> {
  message: M;
  body: B | null;
  status: S;
}
