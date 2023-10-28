import { Module } from '@nestjs/common';
import { AuthLibService } from './services';
import { RmqLibModule } from '@app/rmq-lib';
import { QueueNames } from '@app/common-lib';
import { UtilsLibModule } from '@app/utils-lib';

@Module({
  imports: [RmqLibModule.register({ name: QueueNames.USERS_QUEUE }), UtilsLibModule],
  providers: [AuthLibService],
  exports: [AuthLibService],
})
export class AuthLibModule {}
