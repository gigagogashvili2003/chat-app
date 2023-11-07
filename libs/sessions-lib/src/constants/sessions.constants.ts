import { GenericRepository } from '@app/common-lib';
import { Session } from '@prisma/client';

export const SessionsRepository = GenericRepository<Session>;
