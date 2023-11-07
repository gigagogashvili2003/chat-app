import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLibService } from '../services/auth-lib.service';
import { ErrorMessages } from '@app/common-lib';
import { UserWithoutPassword } from '@app/users-lib';
import { HashService } from '@app/utils-lib';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  public constructor(
    private readonly authService: AuthLibService,
    private readonly hashService: HashService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  public async validate(email: string, password: string): Promise<UserWithoutPassword> {
    const user = await this.authService.validateUser(email);
    if (!user) throw new UnauthorizedException(ErrorMessages.USER_NOT_FOUND);

    const passwordsMatch = await this.hashService.compare(password, user.password);
    if (!passwordsMatch) throw new BadRequestException(ErrorMessages.INCORRECT_PASSWORD);

    return user;
  }
}
