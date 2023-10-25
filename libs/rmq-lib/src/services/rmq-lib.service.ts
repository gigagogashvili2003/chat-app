import { QueueNames } from '@app/common-lib';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqLibService {
  constructor(private readonly configService: ConfigService) {}

  public getOptions(queue: QueueNames): RmqOptions {
    const RABBITMQ_USER = this.configService.get<string>('RABBITMQ_DEFAULT_USER');
    const RABBITMQ_PASSWORD = this.configService.get<string>('RABBITMQ_DEFAULT_PASS');
    const RABBITMQ_HOST = this.configService.get<string>('RABBITMQ_HOST');
    const RABBITMQ_QUEUE_NAME = this.configService.get<string>(`RABBITMQ_${queue}_QUEUE`);
    const RABBITMQ_BASE_URL = this.configService.get<string>('RABBITMQ_BASE_URL');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`${RABBITMQ_BASE_URL}${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}`],
        queue: RABBITMQ_QUEUE_NAME,
        persistent: true,
      },
    };
  }
}
