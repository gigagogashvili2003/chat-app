import { CreateUserDto } from '@app/auth-lib';
import { MessagePatterns } from '@app/common-lib';
import { UsersLibService, UsersMessagePatterns } from '@app/users-lib';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Controller()
export class UsersController {
  public constructor(private readonly usersLibService: UsersLibService) {}

  @MessagePattern(UsersMessagePatterns.FIND_ONE_EMAIL)
  public findOneByEmail(@Payload() email: string) {
    return this.usersLibService.findOneByEmail(email);
  }

  @MessagePattern(UsersMessagePatterns.FIND_ONE_USERNAME)
  public findOneByUsername(@Payload() username: string) {
    return this.usersLibService.findOneByUsername(username);
  }

  @MessagePattern(UsersMessagePatterns.CREATE_USER)
  public create(@Payload() userCreateInput: Prisma.UserCreateInput) {
    return this.usersLibService.create(userCreateInput);
  }
}
