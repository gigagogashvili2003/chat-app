import { EvenetNames } from '@app/common-lib';
import { UsersLibService } from '@app/users-lib';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersLibService: UsersLibService) {}

  @EventPattern(EvenetNames.USERS_EXIST)
  public findUser(@Payload() data: any): Promise<boolean> | boolean {
    return true;
  }
}
