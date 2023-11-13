import { RedisLibRepository } from '../repositories';

export const redisProviders = [
  {
    provide: RedisLibRepository,
    useValue: RedisLibRepository,
  },
];
