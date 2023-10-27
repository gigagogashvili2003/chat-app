import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { RmqLibService } from '@app/rmq-lib';
import { QueueNames } from '@app/common-lib';
import { RmqOptions } from '@nestjs/microservices';
import * as notificationsConstants from '@app/notifications-lib';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  const configService = app.get<ConfigService>(ConfigService);
  const rmqLibService = app.get<RmqLibService>(RmqLibService);

  const microservice = app.connectMicroservice<RmqOptions>(rmqLibService.getOptions(QueueNames.NOTIFICATIONS_QUEUE));
  const PORT = configService.get<number>(notificationsConstants.NOTIFICATIONS_PORT);

  app.setGlobalPrefix(notificationsConstants.NOTIFICATIONS_PREFIX);

  await app.startAllMicroservices();

  await app.listen(PORT);
}

bootstrap();
