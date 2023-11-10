import { UserWithoutPassword } from '@app/users-lib';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../interfaces';
import { User } from '@prisma/client';
export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserWithoutPassword => {
  const request: RequestWithUser<User> = ctx.switchToHttp().getRequest();
  return request.user;
});
