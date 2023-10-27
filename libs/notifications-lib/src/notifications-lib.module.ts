import { Module } from '@nestjs/common';
import { mailSenderServiceProvider, notificationsModuleProviders } from './providers';

@Module({
  imports: [],
  providers: [...notificationsModuleProviders],
  exports: [mailSenderServiceProvider],
})
export class NotificationsLibModule {}
