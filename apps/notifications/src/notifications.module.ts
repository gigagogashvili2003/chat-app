import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { RmqLibModule } from '@app/rmq-lib';
import { ConfigModule } from '@nestjs/config';
import {
  NOTIFICATIONS_ENV_FILE_PATH,
  NotificationsEnvSchemaValidation,
  NotificationsLibModule,
} from '@app/notifications-lib';
import { CommonLibModule } from '@app/common-lib';

@Module({
  imports: [
    NotificationsLibModule,
    RmqLibModule,
    CommonLibModule,
    ConfigModule.forRoot({
      envFilePath: NOTIFICATIONS_ENV_FILE_PATH,
      validationSchema: NotificationsEnvSchemaValidation,
    }),
  ],
  controllers: [NotificationsController],
  providers: [],
})
export class NotificationsModule {}
