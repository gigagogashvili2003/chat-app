import { UsersLibService } from '@app/users-lib';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersLibService: UsersLibService) {}

  @EventPattern('user_exists')
  public findUser(@Payload() data: any) {
    console.log(data);
    return data;
  }
}
