import { Inject, Injectable } from '@nestjs/common';
import { SessionPrismaRepository } from '../repositories';
import { SessionsRepository } from '../constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessionsLibService {
  public constructor(@Inject(SessionsRepository) private readonly sessionsRepository: SessionPrismaRepository) {}

  public create(entity: Prisma.SessionCreateManyInput) {
    return this.sessionsRepository.create(entity);
  }

  public delete() {}

  public findOneById(id: number) {}

  public findOneByDeviceId(deviceId: string) {
    return this.sessionsRepository.findOneByDeviceId(deviceId);
  }
}
