import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { RmqLibService } from '@app/rmq-lib';
import { QueueNames } from '@app/common-lib';
import { RmqOptions } from '@nestjs/microservices';
import * as notificationsConstants from '@app/notifications-lib';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  const rmqLibService = app.get<RmqLibService>(RmqLibService);

  const microservice = app.connectMicroservice<RmqOptions>(rmqLibService.getOptions(QueueNames.NOTIFICATIONS_QUEUE));

  app.setGlobalPrefix(notificationsConstants.NOTIFICATIONS_PREFIX);

  app.startAllMicroservices();
}

bootstrap();
