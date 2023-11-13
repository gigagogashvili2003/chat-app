import { Injectable } from '@nestjs/common';
import { IRedisLibRepository } from '../interfaces';
import { Redis, RedisKey, RedisValue } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisTTLS } from '../enums';
@Injectable()
export class RedisLibRepository implements IRedisLibRepository {
  private redis: Redis;

  public constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      port: this.configService.get<number>('REDIS_PORT'),
      host: this.configService.get<string>('REDIS_HOST'),
    });
  }

  public set(key: RedisKey, value: RedisValue, ttl?: RedisTTLS): Promise<'OK'> {
    return this.redis.set(key, value, 'EX', ttl || RedisTTLS.ONE_HOUR);
  }

  public get(key: RedisKey): Promise<string> {
    return this.redis.get(key);
  }

  public update(key: RedisKey, value: RedisValue): Promise<'OK'> {
    return this.redis.set(key, value, 'XX');
  }

  public delete(key: RedisKey): Promise<number> {
    return this.redis.del(key);
  }
}
