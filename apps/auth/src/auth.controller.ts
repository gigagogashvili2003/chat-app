import {
  AuthEndpoints,
  AuthLibService,
  ChangePasswordDto,
  ChangePasswordSchema,
  CreateUserDto,
  CreateUserSchema,
  SessionCreateInput,
  SignInResponse,
  VerifyAccountDto,
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
  HttpStatus,
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

  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  @Post(AuthEndpoints.SIGNUP)
  public signup(@Body() createUserDto: CreateUserDto): Promise<GenericResponse<null>> {
    return this.authLibService.signup(createUserDto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(LocalGuard)
  @Post(AuthEndpoints.SIGNIN)
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

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AccessTokenGuard)
  @Post(AuthEndpoints.SIGNOUT)
  public signout(@Req() request: RequestWithUser<User>) {
    const deviceId = request.headers['device-id'] as string;
    return this.authLibService.signout(request.user, deviceId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AccessTokenGuard)
  @Post(AuthEndpoints.REQUEST_ACCOUNT_VERIFICATION)
  public requestAccountVerification(@CurrentUser() user: User) {
    return this.authLibService.requestAccountVerification(user);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AccessTokenGuard)
  @Patch(AuthEndpoints.VERIFY_ACCOUNT)
  public verifyAccount(
    @CurrentUser() user: User,
    @Query(new JoiValidationPipe(VerifyAccountSchema)) params: VerifyAccountDto,
  ) {
    return this.authLibService.verifyAccount(user, params.otp);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AccessTokenGuard)
  @Patch(AuthEndpoints.CHANGE_PASSWORD)
  public changePassword(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(ChangePasswordSchema)) changePasswordDto: ChangePasswordDto,
  ) {
    return this.authLibService.changePassword(user, changePasswordDto);
  }
}
