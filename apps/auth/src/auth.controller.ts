import { AuthLibService, CreateUserDto, CreateUserSchema, SignInResponse } from '@app/auth-lib';
import {
  AccessTokenGuard,
  ErrorMessages,
  GenericResponse,
  JoiValidationPipe,
  LocalGuard,
  RequestWithUser,
  UserJwtPayload,
} from '@app/common-lib';
import { BadRequestException, Body, Controller, HttpCode, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
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
  public async signin(@Req() request: RequestWithUser<User>): Promise<GenericResponse<SignInResponse>> {
    const { id, email, role, username } = request.user;

    const deviceId = request.headers['device-id'] as string;

    if (!deviceId) {
      throw new BadRequestException(ErrorMessages.DEVICE_ID_MISSING);
    }

    const payload: UserJwtPayload = {
      sub: id,
      email,
      role,
      username,
    };

    const [accessToken, refreshToken] = await this.authLibService.signTokens(payload);

    const { cookie: accessTokenCookie, accessTokenExpiresAt } =
      this.authLibService.generateAccessTokenCookie(accessToken);
    const { cookie: refreshTokenCookie, refreshTokenExpiresAt } =
      this.authLibService.generateRefreshTokenCookie(refreshToken);

    const sessionPayload = {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      userId: id,
      deviceId,
    };

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return this.authLibService.signin(request.user, sessionPayload);
  }

  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @Post('signout')
  public signout(@Req() request: RequestWithUser<User>) {
    const deviceId = request.headers['device-id'] as string;

    return this.authLibService.signout(request.user, deviceId);
  }
}
