import { ErrorMessages, UserJwtPayload } from '@app/common-lib';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthLibService } from '../services';
import { UserWithoutPassword } from '@app/users-lib';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh_token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authLibService: AuthLibService,
  ) {
    super({
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request.cookies['refresh_token'];

          if (!token) {
            return null;
          }
          return token;
        },
      ]),
    });
  }
  public async validate(payload: UserJwtPayload): Promise<UserWithoutPassword> {
    if (payload === null) {
      throw new UnauthorizedException(ErrorMessages.REFRESH_TOKEN_MISSING);
    }

    const user = await this.authLibService.validateUser(payload.email);

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.NOT_AUTHORIZED);
    }

    const { password, ...useWithoutPassword } = user;

    return useWithoutPassword;
  }
}
