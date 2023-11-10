import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@app/common-lib';
import { Prisma, Session } from '@prisma/client';

@Injectable()
export class SessionPrismaRepository extends GenericRepository<Session> {
  deleteById(
    id: number,
  ): Promise<{
    id: number;
    deviceId: string;
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }
  public constructor(private readonly prisma: PrismaLibService) {
    super();
  }

  public create(entity: Prisma.SessionCreateManyInput): Promise<Session> {
    return this.prisma.session.create({ data: { ...entity } });
  }
  public update(id: number): Promise<Session> {
    throw new Error('Method not implemented.');
  }
  public delete(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session.delete({ where });
  }

  public findOneByDeviceId(deviceId: string) {
    return this.prisma.session.findUnique({ where: { deviceId } });
  }

  public findOneById(id: number): Promise<Session> {
    return this.prisma.session.findFirst({ where: { id } });
  }

  public findOneByToken(token: string): Promise<Session> {
    return this.prisma.session.findFirst({ where: { refreshToken: token } });
  }

  public find(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session.findUnique({ where });
  }
}
