import { AuthLibService, CreateUserDto, CreateUserSchema } from '@app/auth-lib';
import { JoiValidationPipe } from '@app/common-lib';
import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';

@Controller()
export class AuthController {
  public constructor(private readonly authLibService: AuthLibService) {}

  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  @Post('signup')
  public signup(@Body() createUserDto: CreateUserDto) {
    return this.authLibService.signup(createUserDto);
  }
}
