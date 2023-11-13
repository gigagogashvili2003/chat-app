import { REDIS_REPOSITORY } from '../constants';
import { RedisLibRepository } from '../repositories';

export const redisProviders = [
  {
    provide: REDIS_REPOSITORY,
    useClass: RedisLibRepository,
  },
];
