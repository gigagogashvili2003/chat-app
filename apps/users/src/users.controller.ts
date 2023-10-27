import { MessagePatterns } from '@app/common-lib';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  public constructor() {}

  @MessagePattern(MessagePatterns.FIND_ONE)
  public async findOne(@Payload() data: any) {
    return 'HELLO';
  }
}
