import { Module } from '@nestjs/common';
import { SessionsLibService } from './services';
import { sessionsProviders } from './providers';
import { PrismaLibModule } from '@app/prisma-lib';

@Module({
  imports: [PrismaLibModule],
  providers: [SessionsLibService, ...sessionsProviders],
  exports: [SessionsLibService, ...sessionsProviders],
})
export class SessionsLibModule {}
