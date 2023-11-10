import { Inject, Injectable } from '@nestjs/common';
import { SessionPrismaRepository } from '../repositories';
import { SessionsRepository } from '../constants';
import { Prisma, Session } from '@prisma/client';

@Injectable()
export class SessionsLibService {
  public constructor(@Inject(SessionsRepository) private readonly sessionsRepository: SessionPrismaRepository) {}

  public create(entity: Prisma.SessionCreateManyInput) {
    return this.sessionsRepository.create(entity);
  }

  public delete(where: Prisma.SessionWhereUniqueInput) {
    return this.sessionsRepository.delete(where);
  }

  public findOneById(id: number) {}

  public findOneByDeviceId(deviceId: string) {
    return this.sessionsRepository.findOneByDeviceId(deviceId);
  }

  public find(where: Prisma.SessionWhereUniqueInput) {
    return this.sessionsRepository.find(where);
  }
}
