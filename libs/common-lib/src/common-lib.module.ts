import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalEnvSchemaValidation } from './schemas';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validationSchema: GlobalEnvSchemaValidation })],
  providers: [],
  exports: [],
})
export class CommonLibModule {}
