import { Module } from '@nestjs/common';
import { notificationsProviders } from './providers';

@Module({
  imports: [],
  providers: [...notificationsProviders],
  exports: [...notificationsProviders],
})
export class NotificationsLibModule {}
