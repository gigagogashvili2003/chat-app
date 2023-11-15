import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { $Enums, Prisma, User } from '@prisma/client';
import { GenericRepository } from '@app/common-lib';

@Injectable()
export class UsersPrismaRepository extends GenericRepository<User> {
  public constructor(private readonly prisma: PrismaLibService) {
    super();
  }

  public create(entity: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: { ...entity },
    });
  }

  public update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
  public delete(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  deleteById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public findUnique(args: Prisma.UserFindUniqueArgs): Promise<User> {
    return this.prisma.user.findUnique(args);
  }

  public findOneById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { email } });
  }
  public findOneByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  public findMany(params: Prisma.UserFindManyArgs): Promise<Array<User>> {
    return this.prisma.user.findMany(params);
  }
}
