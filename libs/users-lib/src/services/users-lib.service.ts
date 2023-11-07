import { Inject, Injectable } from '@nestjs/common';
import { UsersPrismaRepository } from '../repositories';
import { UsersRepository } from '../constants';
import { Prisma } from '@prisma/client';
@Injectable()
export class UsersLibService {
  public constructor(@Inject(UsersRepository) private readonly usersRepository: UsersPrismaRepository) {}

  public findOneByEmail(email: string, include?: Prisma.UserInclude) {
    return this.usersRepository.findOneByEmail(email, include);
  }

  public findOneByUsername(username: string) {
    return this.usersRepository.findOneByUsername(username);
  }

  public create(userCreateInput: Prisma.UserCreateInput) {
    return this.usersRepository.create(userCreateInput);
  }
}
