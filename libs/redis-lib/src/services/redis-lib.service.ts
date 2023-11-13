import { Inject, Injectable } from '@nestjs/common';
import { RedisKey, RedisValue } from 'ioredis';
import { IRedisLibRepository } from '../interfaces';
import { REDIS_REPOSITORY } from '../constants';
import { RedisTTLS } from '../enums';

@Injectable()
export class RedisLibService {
  public constructor(@Inject(REDIS_REPOSITORY) private readonly redisRepository: IRedisLibRepository) {}

  public set(key: RedisKey, value: RedisValue, ttl?: RedisTTLS): Promise<'OK'> {
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
