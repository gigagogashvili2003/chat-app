import { GenericRepository } from '@app/common-lib';
import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { Follower, Prisma } from '@prisma/client';

@Injectable()
export class FollowersRepository extends GenericRepository<Follower> {
  public constructor(private readonly prismaService: PrismaLibService) {
    super();
  }

  public findOneById(id: number) {
    return this.prismaService.follower.findUnique({ where: { id } });
  }
  public create(entity: Prisma.FollowerCreateManyInput) {
    return this.prismaService.follower.create({ data: { ...entity } });
  }
  public deleteById(id: number) {
    return this.prismaService.follower.delete({ where: { id } });
  }

  public findOne(where: Prisma.FollowerWhereInput) {
    return this.prismaService.follower.findFirst({ where });
  }
}
