import { Module } from '@nestjs/common';
import { HashService, UtilsLibService } from './services';
import { JwtService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ global: true })],
  providers: [UtilsLibService, HashService, JwtService],
  exports: [UtilsLibService, HashService, JwtService],
})
export class UtilsLibModule {}
