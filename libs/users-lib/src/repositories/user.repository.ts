import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
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
  public update(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  public delete(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public findUnique(args: Prisma.UserFindUniqueArgs): Promise<User> {
    return this.prisma.user.findUnique(args);
  }

  public findOneById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public findOneByEmail(email: string, include?: Prisma.UserInclude): Promise<User> {
    return this.prisma.user.findFirst({ where: { email }, include });
  }
  public findOneByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  public findMany(params: Prisma.UserFindManyArgs): Promise<Array<User>> {
    return this.prisma.user.findMany(params);
  }
}
