import { ErrorMessages, UserJwtPayload } from '@app/common-lib';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { AuthLibService } from '../services';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access_token') {
  public constructor(
    private readonly configService: ConfigService,
    private readonly authLibService: AuthLibService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  public async validate(payload: UserJwtPayload) {
    const user = await this.authLibService.validateUser(payload.email);
    if (!user) throw new UnauthorizedException(ErrorMessages.NOT_AUTHORIZED);

    return user;
  }
}
