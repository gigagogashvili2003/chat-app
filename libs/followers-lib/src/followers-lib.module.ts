import { Module } from '@nestjs/common';
import { FollowersLibService } from './services';
import { RmqLibModule } from '@app/rmq-lib';
import { CommonLibModule, QueueNames } from '@app/common-lib';
import { FollowersRepository } from './repositories/followers.repository';
import { PrismaLibModule } from '@app/prisma-lib';

@Module({
  imports: [RmqLibModule.register({ name: QueueNames.USERS_QUEUE }), CommonLibModule, PrismaLibModule],
  providers: [FollowersLibService, FollowersRepository],
  exports: [FollowersLibService],
})
export class FollowersLibModule {}
