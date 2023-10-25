import { Module } from '@nestjs/common';
import { AuthLibService } from './services';
import { RmqLibModule } from '@app/rmq-lib';
import { QueueNames } from '@app/common-lib';

@Module({
  imports: [
    RmqLibModule.register({ name: QueueNames.USERS_QUEUE }),
    RmqLibModule.register({ name: QueueNames.NOTIFICATIONS_QUEUE }),
  ],
  providers: [AuthLibService],
  exports: [AuthLibService],
})
export class AuthLibModule {}
