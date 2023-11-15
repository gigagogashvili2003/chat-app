import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChangePasswordDto, CreateUserDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import {
  ErrorMessages,
  GenericResponse,
  QueueNames,
  RedisKeyTypes,
  SuccessMessages,
  UserJwtPayload,
} from '@app/common-lib';
import { last, lastValueFrom } from 'rxjs';
import { IUserUpdate, PromiseUser, UserCreateInput, UsersMessagePatterns } from '@app/users-lib';
import { HashService, JwtService, Tokens, UtilsLibService } from '@app/utils-lib';
import { Prisma, User } from '@prisma/client';
import { SessionsLibService } from '@app/sessions-lib';
import { IGenerateTokenCookie, SessionCreateInput, SignInResponse } from '../interfaces';
import { PrismaErrorCodes, PrismaErrorMessages } from '@app/prisma-lib';
import { RedisLibService, RedisTTLS } from '@app/redis-lib';
import {
  ISendEmailCredentials,
  MAIL_SENDER_SERVICE,
  MailMessages,
  MailSender,
  MailSubjects,
} from '@app/notifications-lib';

@Injectable()
export class AuthLibService {
  public constructor(
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsLibService,
    private readonly utilsLibService: UtilsLibService,
    private readonly redisLibService: RedisLibService,
    @Inject(QueueNames.USERS_QUEUE) private usersClient: ClientProxy,
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
        message: SuccessMessages.USER_SIGNED_IN_SUCCESFULLY,
        status: HttpStatus.ACCEPTED,
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

  public async requestAccountVerification(user: User): Promise<GenericResponse<null>> {
    const { email } = user;
    try {
      const otp = this.utilsLibService.generateOtpCode();
      const redisKey = `${RedisKeyTypes.EMAIL_VERIFICATION}_${email}`;

      const emailCredentialsPayload: ISendEmailCredentials = {
        to: email,
        subject: MailSubjects.EMAIL_VERIFICATION_OTP,
        message: MailMessages.OTP + otp,
      };

      await Promise.all([
        this.redisLibService.set(redisKey, otp, RedisTTLS.FIFTEEN_MINUTE),
        this.mailSenderService.sendMessage(emailCredentialsPayload),
      ]);

      return { message: SuccessMessages.OTP_HAS_SENT, status: HttpStatus.ACCEPTED };
    } catch (err) {
      throw err;
    }
  }

  public async verifyAccount(user: User, otp: string): Promise<GenericResponse<null>> {
    try {
      const redisOtp = await this.redisLibService.get(`${RedisKeyTypes.EMAIL_VERIFICATION}_${user.email}`);

      if (!redisOtp) {
        throw new NotFoundException(ErrorMessages.OTP_NOT_FOUND);
      }

      if (parseInt(redisOtp) !== parseInt(otp)) {
        throw new ConflictException(ErrorMessages.INVALID_OTP);
      }

      const updateUserPayload: IUserUpdate = {
        id: user.id,
        data: { verified: true },
      };

      const updatedUser = await lastValueFrom(
        this.usersClient.send(UsersMessagePatterns.UPDATE_USER, updateUserPayload),
      );
      await this.redisLibService.delete(`${RedisKeyTypes.EMAIL_VERIFICATION}_${user.email}`);

      return { message: SuccessMessages.ACCOUNT_HAS_VERIFIED, status: HttpStatus.ACCEPTED };
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
        status: HttpStatus.ACCEPTED,
        message: SuccessMessages.USER_SIGNED_OUT_SUCCESSFULLY,
      };
    } catch (err) {
      throw err;
    }
  }

  public async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<GenericResponse<null>> {
    const { oldPassword, newPassword } = changePasswordDto;
    const { password } = user;

    try {
      const passwordsMatch = await this.hashService.compare(oldPassword, password);
      const oldAndNewPasswordsAreSame = await this.hashService.compare(newPassword, password);

      if (!passwordsMatch) {
        throw new BadRequestException(ErrorMessages.INVALID_PASSWORD);
      }

      if (oldAndNewPasswordsAreSame) {
        throw new BadRequestException(ErrorMessages.SAME_PASSWORDS);
      }

      const hashedPassword = await this.hashService.hash(newPassword, 10);

      const updateUserPayload: IUserUpdate = {
        id: user.id,
        data: { password: hashedPassword },
      };

      const updatedUser = await lastValueFrom(
        this.usersClient.send(UsersMessagePatterns.UPDATE_USER, updateUserPayload),
      );

      return { status: HttpStatus.OK, message: SuccessMessages.PASSWORD_CHANGED_SUCCESFULLY };
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
