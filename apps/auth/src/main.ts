import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RmqLibService } from '@app/rmq-lib';
import * as AuthContstants from '@app/auth-lib';
import { QueueNames } from '@app/common-lib';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get<ConfigService>(ConfigService);
  const rmqLibService = app.get<RmqLibService>(RmqLibService);

  const microservice = app.connectMicroservice<RmqOptions>(rmqLibService.getOptions(QueueNames.AUTH_QUEUE));

  const PORT = configService.get<number>(AuthContstants.AUTH_PORT);
  app.setGlobalPrefix(AuthContstants.AUTH_PREFIX);

  app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
