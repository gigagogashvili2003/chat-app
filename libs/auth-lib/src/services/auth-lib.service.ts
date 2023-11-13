import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { ErrorMessages, GenericResponse, QueueNames, SuccessMessages, UserJwtPayload } from '@app/common-lib';
import { lastValueFrom } from 'rxjs';
import { PromiseUser, UserCreateInput, UsersMessagePatterns } from '@app/users-lib';
import { HashService, JwtService, Tokens, UtilsLibService } from '@app/utils-lib';
import { Prisma, User } from '@prisma/client';
import { SessionsLibService } from '@app/sessions-lib';
import { IGenerateTokenCookie, SessionCreateInput, SignInResponse } from '../interfaces';
import { PrismaErrorCodes, PrismaErrorMessages } from '@app/prisma-lib';
import { RedisLibService } from '@app/redis-lib';
import { MAIL_SENDER_SERVICE, MailSender } from '@app/notifications-lib';

@Injectable()
export class AuthLibService {
  public constructor(
    @Inject(QueueNames.USERS_QUEUE) private usersClient: ClientProxy,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsLibService,
    private readonly utilsLibService: UtilsLibService,
    private readonly redisLibService: RedisLibService,
    @Inject(MAIL_SENDER_SERVICE) private readonly mailSenderService: MailSender,
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

      const newUserPayload: UserCreateInput = {
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

  public async signin(user: User, sessionPayload: SessionCreateInput): Promise<GenericResponse<SignInResponse>> {
    try {
      const { password, ...userWithoutPassword } = user;

      const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = sessionPayload;

      const sessionAlreadyExists = await this.sessionsService.find({
        userId: user.id,
        deviceId: sessionPayload.deviceId,
      });

      if (!sessionAlreadyExists) {
        await this.sessionsService.create(sessionPayload);
      }

      return {
        message: SuccessMessages.USER_CREATED_SUCCESFULLY,
        status: HttpStatus.CREATED,
        body: {
          userInfo: userWithoutPassword,
          tokenInfo: {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
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

  public requestAccountVerification(user: User) {
    try {
      const otp = this.utilsLibService.generateOtpCode();
    } catch (err) {
      throw err;
    }
  }

  public async signout(user: User, deviceId: string): Promise<GenericResponse<null>> {
    try {
      if (!deviceId) {
        throw new BadRequestException(ErrorMessages.DEVICE_ID_MISSING);
      }

      const session = await this.sessionsService.find({ userId: user.id, deviceId });

      if (!session) {
        throw new NotFoundException(ErrorMessages.SESSION_NOT_FOUND);
      }

      await this.sessionsService.delete({ deviceId, userId: user.id });

      return {
        status: 200,
        message: SuccessMessages.USER_SIGNED_OUT_SUCCESSFULLY,
      };
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

  public generateAccessTokenCookie(accessToken: string): IGenerateTokenCookie {
    const accessTokenExpiresAt = this.jwtService.getAccessTokenExpirationTime();
    const accessTokenMaxAge = this.jwtService.getAccessTokenMaxAge();

    const cookie = `AccessToken=${accessToken}; HttpOnly; Expires=${accessTokenExpiresAt}; Max-Age=${accessTokenMaxAge}`;

    return { cookie, expiresAt: accessTokenExpiresAt };
  }

  public generateRefreshTokenCookie(refreshToken: string): IGenerateTokenCookie {
    const refreshTokenExpiresAt = this.jwtService.getRefreshTokenExpirationTime();
    const refreshTokenMaxAge = this.jwtService.getRefreshTokenMaxAge();

    const cookie = `RefreshToken=${refreshToken}; HttpOnly; Expires=${refreshTokenExpiresAt}; Max-Age=${refreshTokenMaxAge}`;
    return { cookie, expiresAt: refreshTokenExpiresAt };
  }

  public signTokens(payload: UserJwtPayload): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.sign(payload, Tokens.ACCESS_TOKEN),
      this.jwtService.sign(payload, Tokens.REFRESH_TOKEN),
    ]);
  }
}
