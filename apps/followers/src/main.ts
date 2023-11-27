import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RmqLibService } from '@app/rmq-lib';
import * as FollowersConstants from '@app/followers-lib/constants';
import { QueueNames } from '@app/common-lib';
import { FollowersModule } from './followers.module';

async function bootstrap() {
  const app = await NestFactory.create(FollowersModule);

  const configService = app.get<ConfigService>(ConfigService);
  const rmqLibService = app.get<RmqLibService>(RmqLibService);

  const microservice = app.connectMicroservice<RmqOptions>(rmqLibService.getOptions(QueueNames.FOLLOWERS_QUEUE));

  const PORT = configService.get<number>(FollowersConstants.FOLLOWERS_PORT);
  app.setGlobalPrefix(FollowersConstants.FOLLOWERS_PREFIX);

  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
