import { Module } from '@nestjs/common';
import { RedisLibService } from './services';
import { redisProviders } from './providers';

@Module({
  providers: [RedisLibService, ...redisProviders],
  exports: [RedisLibService, ...redisProviders],
})
export class RedisLibModule {}
