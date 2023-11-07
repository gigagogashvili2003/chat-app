import { Module } from '@nestjs/common';
import { UsersLibService } from './services';
import { PrismaLibModule } from '@app/prisma-lib';
import { usersLibProviders } from './providers';
import { SessionsLibModule } from '@app/sessions-lib';

@Module({
  imports: [PrismaLibModule],
  providers: [UsersLibService, ...usersLibProviders],
  exports: [UsersLibService],
})
export class UsersLibModule {}
