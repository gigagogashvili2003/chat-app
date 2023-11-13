import { RedisKey, RedisValue } from 'ioredis';

export interface IRedisLibRepository {
  set(key: RedisKey, value: RedisValue, ttl?: number): Promise<'OK'>;
  get(key: RedisKey): Promise<string>;
  update(key: RedisKey, value: RedisValue): Promise<'OK'>;
  delete(key: RedisKey): Promise<number>;
}
