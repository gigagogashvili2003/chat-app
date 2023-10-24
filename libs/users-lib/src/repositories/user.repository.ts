import { GenericRepository } from '@app/common-lib';
import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { $Enums, Prisma, User } from '@prisma/client';
import { UsersRepository } from '../constants';

@Injectable()
export class UsersPrismaRepository extends UsersRepository {
  public constructor(private readonly prisma: PrismaLibService) {
    super();
  }

  findOneById(id: number): Promise<User> {
    this.prisma.user.findMany({});
    throw new Error('Method not implemented.');
  }

  find(params: Prisma.UserFindManyArgs): Promise<Array<User>> {
    return this.prisma.user.findMany(params);
  }
}
