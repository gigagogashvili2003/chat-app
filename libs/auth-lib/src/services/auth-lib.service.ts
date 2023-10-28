import { ConflictException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { ErrorMessages, GenericResponse, QueueNames, SuccessMessages } from '@app/common-lib';
import { lastValueFrom } from 'rxjs';
import { UsersMessagePatterns } from '@app/users-lib';
import { HashService } from '@app/utils-lib';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthLibService {
  public constructor(
    @Inject(QueueNames.USERS_QUEUE) private usersClient: ClientProxy,
    private readonly hashService: HashService,
  ) {}

  public async signup(createUserDto: CreateUserDto) {
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
        body: null,
      };
    } catch (err) {
      throw err;
    }
  }
}
