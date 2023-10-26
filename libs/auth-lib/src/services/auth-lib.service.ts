import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { MessagePatterns, QueueNames } from '@app/common-lib';

@Injectable()
export class AuthLibService {
  public constructor(@Inject(QueueNames.USERS_QUEUE) private readonly usersClient: ClientProxy) {}

  public async signup(createUserDto: CreateUserDto) {
    const userExists = this.usersClient.send(MessagePatterns.FIND_ONE, { id: 1 });
    console.log(userExists);
    return this.usersClient.send('find_user', { id: 1 });
  }
}
