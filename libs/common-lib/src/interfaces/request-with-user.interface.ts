import { UserWithoutPassword } from '@app/users-lib';
import { User } from '@prisma/client';
import { Request } from 'express';
export interface RequestWithUser<T extends UserWithoutPassword> extends Request {
  user: T;
}

export interface RequestWithUserNotOmitPassword<T extends User> extends Request {
  user: T;
}
