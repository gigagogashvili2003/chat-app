import { UsersRepository } from '../constants';
import { UsersPrismaRepository } from '../repositories';

export const usersLibProviders = [
  {
    provide: UsersRepository,
    useClass: UsersPrismaRepository,
  },
];
