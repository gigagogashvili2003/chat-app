import { Inject, Injectable } from '@nestjs/common';
import { RedisKey, RedisValue } from 'ioredis';
import { IRedisLibRepository } from '../interfaces';
import { RedisLibRepository } from '../repositories';

@Injectable()
export class RedisLibService {
  public constructor(@Inject(RedisLibRepository) private readonly redisRepository: IRedisLibRepository) {}

  public set(key: RedisKey, value: RedisValue, ttl?: number): Promise<'OK'> {
    return this.redisRepository.set(key, value, ttl);
  }

  public get(key: RedisKey): Promise<string> {
    return this.redisRepository.get(key);
  }

  public update(key: RedisKey, value: RedisValue): Promise<'OK'> {
    return this.redisRepository.set(key, value);
  }

  public delete(key: RedisKey): Promise<number> {
    return this.redisRepository.delete(key);
  }
}
