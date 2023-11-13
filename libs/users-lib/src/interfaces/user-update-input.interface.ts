import { Prisma } from '@prisma/client';

export interface IUserUpdate {
  data: Prisma.UserUpdateInput;
  id: number;
}
