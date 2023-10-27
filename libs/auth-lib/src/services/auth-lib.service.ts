import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { QueueNames } from '@app/common-lib';

@Injectable()
export class AuthLibService {
  public constructor(@Inject(QueueNames.USERS_QUEUE) private usersClient: ClientProxy) {}

  public async signup(createUserDto: CreateUserDto) {
    try {
      // const userExists = await lastValueFrom(this.usersClient.send(MessagePatterns.FIND_ONE, { id: 1 }));
      return 'MOVIDA';
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
