import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { EvenetNames, QueueNames } from '@app/common-lib';

@Injectable()
export class AuthLibService {
  public constructor(
    @Inject(QueueNames.USERS_QUEUE) private readonly usersClient: ClientProxy,
    @Inject(QueueNames.NOTIFICATIONS_QUEUE) private readonly notificationsClient: ClientProxy,
  ) {}

  public async signup(createUserDto: CreateUserDto) {
    try {
      const userExistenceStatus = await this.usersClient.send(EvenetNames.USERS_EXIST, { id: 1 });
      if (userExistenceStatus) {
        throw new BadRequestException('User with this email already exist!');
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
