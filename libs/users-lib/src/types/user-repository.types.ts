import { GenericRepository } from '@app/common-lib';
import { Prisma, User } from '@prisma/client';

export type UsersRepositoryType = GenericRepository<User, Prisma.UserFindManyArgs, Prisma.UserCreateInput>;
