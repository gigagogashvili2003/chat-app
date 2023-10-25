import { Module } from '@nestjs/common';
import { mailSenderServiceProvider, notificationsModuleProviders } from './providers';
import { RmqLibModule } from '@app/rmq-lib';
import { QueueNames } from '@app/common-lib';

@Module({
  imports: [RmqLibModule.register({ name: QueueNames.NOTIFICATIONS_QUEUE })],
  providers: [...notificationsModuleProviders],
  exports: [mailSenderServiceProvider],
})
export class NotificationsLibModule {}
