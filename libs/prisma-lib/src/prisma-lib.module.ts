import { Module } from '@nestjs/common';
import { PrismaLibService } from './services/prisma-lib.service';

@Module({
  providers: [PrismaLibService],
  exports: [PrismaLibService],
})
export class PrismaLibModule {}
