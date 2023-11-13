import {
  AuthLibService,
  CreateUserDto,
  CreateUserSchema,
  SessionCreateInput,
  SignInResponse,
  VerifyAccountSchema,
} from '@app/auth-lib';
import {
  AccessTokenGuard,
  CurrentUser,
  ErrorMessages,
  GenericResponse,
  JoiValidationPipe,
  LocalGuard,
  RequestWithUser,
  UserJwtPayload,
} from '@app/common-lib';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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

    const { cookie: accessTokenCookie, expiresAt: accessTokenExpiresAt } =
      this.authLibService.generateAccessTokenCookie(accessToken);
    const { cookie: refreshTokenCookie, expiresAt: refreshTokenExpiresAt } =
      this.authLibService.generateRefreshTokenCookie(refreshToken);

    const sessionPayload: SessionCreateInput = {
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

  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @Post('request-account-verification')
  public requestAccountVerification(@CurrentUser() user: User) {
    return this.authLibService.requestAccountVerification(user);
  }

  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @Patch('verify-account')
  public verifyAccount(
    @CurrentUser() user: User,
    @Query(new JoiValidationPipe(VerifyAccountSchema)) params: { otp: string },
  ) {
    return this.authLibService.verifyAccount(user, parseInt(params.otp, 10));
  }
}
