import { CreateUserDto } from '@app/auth-lib';
import { MessagePatterns } from '@app/common-lib';
import { PromiseUser, UsersLibService, UsersMessagePatterns } from '@app/users-lib';
import { IUserUpdate } from '@app/users-lib/interfaces/user-update-input.interface';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Prisma, User } from '@prisma/client';

@Controller()
export class UsersController {
  public constructor(private readonly usersLibService: UsersLibService) {}

  @MessagePattern(UsersMessagePatterns.FIND_ONE_EMAIL)
  public findOneByEmail(@Payload() email: string): PromiseUser {
    return this.usersLibService.findOneByEmail(email);
  }

  @MessagePattern(UsersMessagePatterns.FIND_ONE_USERNAME)
  public findOneByUsername(@Payload() username: string): PromiseUser {
    return this.usersLibService.findOneByUsername(username);
  }

  @MessagePattern(UsersMessagePatterns.FIND_ONE_ID)
  public findOneById(@Payload() id: number): Promise<User> {
    return this.usersLibService.findOneById(id);
  }

  @MessagePattern(UsersMessagePatterns.CREATE_USER)
  public create(@Payload() userCreateInput: Prisma.UserCreateInput) {
    return this.usersLibService.create(userCreateInput);
  }

  @MessagePattern(UsersMessagePatterns.UPDATE_USER)
  public update(@Payload() userUpdatePayload: IUserUpdate) {
    return this.usersLibService.update(userUpdatePayload.id, userUpdatePayload.data);
  }
}
