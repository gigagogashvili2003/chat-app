import { Inject, Injectable } from '@nestjs/common';
import { UsersPrismaRepository } from '../repositories';
import { UsersRepository } from '../constants';
import { Prisma } from '@prisma/client';
@Injectable()
export class UsersLibService {
  public constructor(@Inject(UsersRepository) private readonly usersRepository: UsersPrismaRepository) {}

  public findOneByEmail(email: string) {
    return this.usersRepository.findOneByEmail(email);
  }

  public findOneByUsername(username: string) {
    return this.usersRepository.findOneByUsername(username);
  }

  public create(userCreateInput: Prisma.UserCreateInput) {
    return this.usersRepository.create(userCreateInput);
  }

  public update(id: number, data: Prisma.UserUpdateInput) {
    return this.usersRepository.update(id, data);
  }
}
