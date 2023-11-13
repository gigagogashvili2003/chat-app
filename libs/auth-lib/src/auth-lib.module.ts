import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthLibService } from './services';
import { RmqLibModule } from '@app/rmq-lib';
import { QueueNames } from '@app/common-lib';
import { UtilsLibModule } from '@app/utils-lib';
import { AuthGatewayMiddleware } from './middlewares';
import { AccessTokenStrategy, LocalStrategy } from './strategies';
import { SessionsLibModule } from '@app/sessions-lib';
import { RedisLibModule } from '@app/redis-lib';
import { NotificationsLibModule } from '@app/notifications-lib';

@Module({
  imports: [
    RmqLibModule.register({ name: QueueNames.USERS_QUEUE }),
    UtilsLibModule,
    SessionsLibModule,
    RedisLibModule,
    NotificationsLibModule,
  ],
  providers: [AuthLibService, LocalStrategy, AccessTokenStrategy],
  exports: [AuthLibService],
})
export class AuthLibModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGatewayMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
