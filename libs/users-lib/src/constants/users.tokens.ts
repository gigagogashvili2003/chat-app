import { GenericRepository } from '@app/common-lib';
import { Prisma, User } from '@prisma/client';

export const UsersRepository = GenericRepository<User, Prisma.UserFindManyArgs, Prisma.UserCreateInput>;
