import { MessagePatterns } from '@app/common-lib';
import { UsersLibService } from '@app/users-lib';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersLibService: UsersLibService) {}

  @MessagePattern(MessagePatterns.FIND_ONE)
  public findOne(@Payload() data: any) {}
}
