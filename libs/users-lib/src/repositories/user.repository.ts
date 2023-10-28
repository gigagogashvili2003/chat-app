import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { GenericRepository } from '@app/common-lib';

@Injectable()
export class UsersPrismaRepository extends GenericRepository<User> {
  public constructor(private readonly prisma: PrismaLibService) {
    super();
  }

  public create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
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

  public findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { email } });
  }
  public findOneByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  public find(params: Prisma.UserFindManyArgs): Promise<Array<User>> {
    return this.prisma.user.findMany(params);
  }
}
