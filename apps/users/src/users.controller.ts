import { UsersLibService } from '@app/users-lib';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  constructor(private readonly usersLibService: UsersLibService) {}

  @Get('/users')
  public getUsers() {
    return this.usersLibService.findAllUser();
  }
}
