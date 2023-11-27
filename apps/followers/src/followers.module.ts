import { Module } from '@nestjs/common';
import { FollowersController } from './followers.controller';
import { FollowersLibModule } from '@app/followers-lib';
import { ConfigModule } from '@nestjs/config';
import { FOLLOWERS_ENV_FILE_PATH } from '@app/followers-lib/constants';
import { AuthLibModule, FollowersSchemaValidation } from '@app/auth-lib';
import { RmqLibModule } from '@app/rmq-lib';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: FOLLOWERS_ENV_FILE_PATH, validationSchema: FollowersSchemaValidation }),
    FollowersLibModule,
    RmqLibModule,
    AuthLibModule,
  ],
  controllers: [FollowersController],
  providers: [],
})
export class FollowersModule {}
