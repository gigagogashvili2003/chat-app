import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../constants';

@Injectable()
export class UsersPrismaRepository extends UsersRepository {
  public constructor(private readonly prisma: PrismaLibService) {
    super();
  }

  public create(data: Prisma.UserCreateInput): Promise<User> {
    throw new Error('Method not implemented.');
  }
  public update(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  public delete(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public findOneById(id: number): Promise<User> {
    this.prisma.user.findMany({});
    throw new Error('Method not implemented.');
  }

  public find(params: Prisma.UserFindManyArgs): Promise<Array<User>> {
    return this.prisma.user.findMany(params);
  }
}
