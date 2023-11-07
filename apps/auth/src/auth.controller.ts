import { AuthLibService, CreateUserDto, CreateUserSchema, SignInResponse, SignOutDto } from '@app/auth-lib';
import { AccessTokenGuard, GenericResponse, JoiValidationPipe, RequestWithUserNotOmitPassword } from '@app/common-lib';
import { LocalGuard } from '@app/common-lib/guards/local-strategy.guard';
import { Body, Controller, HttpCode, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller()
export class AuthController {
  public constructor(private readonly authLibService: AuthLibService) {}

  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  @Post('signup')
  public signup(@Body() createUserDto: CreateUserDto): Promise<GenericResponse<null>> {
    return this.authLibService.signup(createUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalGuard)
  @Post('signin')
  public signin(@Req() request: RequestWithUserNotOmitPassword<User>): Promise<GenericResponse<SignInResponse>> {
    return this.authLibService.signin(request);
  }

  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @Post('signout')
  public signout(@Body() signOutDto: SignOutDto, @Req() request: RequestWithUserNotOmitPassword<User>) {
    return this.authLibService.signout(request, signOutDto);
  }
}
