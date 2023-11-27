import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AUTH_ENV_FILE_PATH, AuthEnvSchemaValidation, AuthLibModule } from '@app/auth-lib';
import { RmqLibModule } from '@app/rmq-lib';
import { CommonLibModule } from '@app/common-lib';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: AUTH_ENV_FILE_PATH, validationSchema: AuthEnvSchemaValidation }),
    RmqLibModule,
    CommonLibModule,
    AuthLibModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
