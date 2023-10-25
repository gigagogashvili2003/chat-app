import { DynamicModule, Module } from '@nestjs/common';
import { RmqLibService } from './services';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueNames } from '@app/common-lib';
import { RmqLibModuleOptions } from './interfaces';

@Module({
  imports: [],
  providers: [RmqLibService],
  exports: [RmqLibService],
})
export class RmqLibModule {
  static register({ name }: RmqLibModuleOptions): DynamicModule {
    return {
      module: RmqLibModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => {
              const RABBITMQ_USER = configService.get<string>('RABBITMQ_DEFAULT_USER');
              const RABBITMQ_PASSWORD = configService.get<string>('RABBITMQ_DEFAULT_PASS');
              const RABBITMQ_HOST = configService.get<string>('RABBITMQ_HOST');
              const RABBITMQ_BASE_URL = configService.get<string>('RABBITMQ_BASE_URL');

              return {
                transport: Transport.RMQ,
                options: {
                  urls: [`${RABBITMQ_BASE_URL}${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}`],
                  queue: name,
                  persistent: true,
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
