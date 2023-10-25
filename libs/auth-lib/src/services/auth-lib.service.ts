import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthLibService {
  public constructor(@Inject('users_queue') private readonly usersClient: ClientProxy) {}

  public signup(createUserDto: CreateUserDto) {
    return this.usersClient.send('user_exists', { id: 1 });
  }
}
