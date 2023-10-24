import { Module } from '@nestjs/common';
import { UsersLibService } from './services';
import { UsersRepository } from './repositories';
import { PrismaLibModule } from '@app/prisma-lib';

@Module({
  imports: [PrismaLibModule],
  providers: [UsersLibService, UsersRepository],
  exports: [UsersLibService],
})
export class UsersLibModule {}
