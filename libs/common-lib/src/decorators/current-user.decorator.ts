import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithUser } from '../interfaces';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: RequestWithUser<User> = ctx.switchToHttp().getRequest();
  return request.user;
});
