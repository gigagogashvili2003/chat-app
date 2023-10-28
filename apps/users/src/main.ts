import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RmqLibService } from '@app/rmq-lib';
import * as UsersConstants from '@app/users-lib';
import { UsersModule } from './users.module';
import { QueueNames } from '@app/common-lib';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  const configService = app.get<ConfigService>(ConfigService);
  const rmqLibService = app.get<RmqLibService>(RmqLibService);

  const microservice = app.connectMicroservice<RmqOptions>(rmqLibService.getOptions(QueueNames.USERS_QUEUE));

  const PORT = configService.get<number>(UsersConstants.USERS_PORT);
  app.setGlobalPrefix(UsersConstants.USERS_PREFIX);

  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
