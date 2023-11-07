import { ConflictException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, SignOutDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import {
  ErrorMessages,
  GenericResponse,
  QueueNames,
  RequestWithUserNotOmitPassword,
  SuccessMessages,
  UserJwtPayload,
} from '@app/common-lib';
import { lastValueFrom } from 'rxjs';
import { PromiseUser, UsersMessagePatterns } from '@app/users-lib';
import { HashService, JwtService, Tokens, UtilsLibService } from '@app/utils-lib';
import { Prisma, User } from '@prisma/client';
import { SessionsLibService } from '@app/sessions-lib';
import { SignInResponse } from '../interfaces';
import { PrismaErrorCodes, PrismaErrorMessages } from '@app/prisma-lib';

@Injectable()
export class AuthLibService {
  public constructor(
    @Inject(QueueNames.USERS_QUEUE) private usersClient: ClientProxy,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsLibService,
    private readonly utilsLibService: UtilsLibService,
  ) {}

  public async signup(createUserDto: CreateUserDto): Promise<GenericResponse> {
    const { email, password, username } = createUserDto;

    try {
      const [userWithEmail, userWithUsername] = await Promise.all([
        lastValueFrom(this.usersClient.send(UsersMessagePatterns.FIND_ONE_EMAIL, email)),
        lastValueFrom(this.usersClient.send(UsersMessagePatterns.FIND_ONE_USERNAME, username)),
      ]);

      if (userWithEmail) {
        throw new ConflictException(ErrorMessages.USER_EMAIL_ALREADY_EXISTS);
      }

      if (userWithUsername) {
        throw new ConflictException(ErrorMessages.USER_USERNAME_ALREADY_EXISTS);
      }

      const hashedPassword = await this.hashService.hash(password, 10);

      const newUserPayload: Prisma.UserCreateInput = {
        ...createUserDto,
        password: hashedPassword,
      };

      const newUser = await lastValueFrom(this.usersClient.send(UsersMessagePatterns.CREATE_USER, newUserPayload));

      return {
        message: SuccessMessages.USER_CREATED_SUCCESFULLY,
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw err;
    }
  }

  public async signin(request: RequestWithUserNotOmitPassword<User>): Promise<GenericResponse<SignInResponse>> {
    const { password, ...userWithoutPassword } = request.user;

    try {
      const payload: UserJwtPayload = {
        sub: userWithoutPassword.id,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        username: userWithoutPassword.username,
      };

      const [accessToken, refreshToken] = await this.signTokens(payload);

      const accessTokenExpirationTime = this.jwtService.getAccessTokenExpirationTime();
      const refreshTokenExpirationTime = this.jwtService.getRefreshTokenExpirationTime();

      const accessTokenMaxAge = this.jwtService.getAccessTokenMaxAge();
      const refreshTokenMaxAge = this.jwtService.getRefreshTokenMaxAge();

      await this.sessionsService.create({
        refreshToken,
        userId: userWithoutPassword.id,
        deviceId: 'Some random string',
        accessToken,
        accessTokenExpiresAt: accessTokenExpirationTime,
        refreshTokenExpiresAt: refreshTokenExpirationTime,
      });

      request.res.cookie(Tokens.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        maxAge: accessTokenMaxAge,
      });
      request.res.cookie(Tokens.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenMaxAge,
      });

      return {
        message: SuccessMessages.USER_CREATED_SUCCESFULLY,
        status: HttpStatus.CREATED,
        body: {
          userInfo: userWithoutPassword,
          tokenInfo: {
            accessToken,
            accessTokenExpiresAt: accessTokenExpirationTime,
            refreshToken,
            refreshTokenExpiresAt: refreshTokenExpirationTime,
          },
        },
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === PrismaErrorCodes.P2002) {
        throw new ConflictException(PrismaErrorMessages[PrismaErrorCodes.P2002]);
      }
      throw err;
    }
  }

  public async signout(request: RequestWithUserNotOmitPassword<User>, signOutDto: SignOutDto) {
    const response = request.res;
    const { deviceId } = signOutDto;

    try {
      console.log(request.user);
      // response.clearCookie(Tokens.ACCESS_TOKEN);
      // response.clearCookie(Tokens.REFRESH_TOKEN);
    } catch (err) {
      throw err;
    }
  }

  public async validateUser(email: string): PromiseUser {
    try {
      const user: User = await lastValueFrom(this.usersClient.send(UsersMessagePatterns.FIND_ONE_EMAIL, email));
      return user;
    } catch (err) {
      throw err;
    }
  }

  public signTokens(payload: UserJwtPayload) {
    return Promise.all([
      this.jwtService.sign(payload, Tokens.ACCESS_TOKEN),
      this.jwtService.sign(payload, Tokens.REFRESH_TOKEN),
    ]);
  }
}
