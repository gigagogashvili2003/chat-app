import { GenericRepository } from '@app/common-lib';
import { User } from '@prisma/client';

export const UsersRepository = GenericRepository<User>;
