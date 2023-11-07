import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@app/common-lib';
import { Prisma, Session } from '@prisma/client';

@Injectable()
export class SessionPrismaRepository extends GenericRepository<Session> {
  public constructor(private readonly prisma: PrismaLibService) {
    super();
  }

  public create(entity: Prisma.SessionCreateManyInput): Promise<Session> {
    return this.prisma.session.create({ data: { ...entity } });
  }
  public update(id: number): Promise<Session> {
    throw new Error('Method not implemented.');
  }
  public delete(id: number): Promise<Session> {
    throw new Error('Method not implemented.');
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

  public find(params: Prisma.SessionFindManyArgs): Promise<Array<Session>> {
    return this.prisma.session.findMany(params);
  }
}
