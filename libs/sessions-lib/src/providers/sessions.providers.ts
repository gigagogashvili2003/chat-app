import { SessionsRepository } from '../constants/sessions.constants';
import { SessionPrismaRepository } from '../repositories';

export const sessionsProviders = [
  {
    provide: SessionsRepository,
    useClass: SessionPrismaRepository,
  },
];
