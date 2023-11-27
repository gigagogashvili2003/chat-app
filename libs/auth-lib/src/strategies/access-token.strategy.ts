import { ErrorMessages, UserJwtPayload } from '@app/common-lib';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthLibService } from '../services';
import { Tokens } from '@app/utils-lib';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, Tokens.ACCESS_TOKEN) {
  public constructor(
    private readonly configService: ConfigService,
    private readonly authLibService: AuthLibService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  public async validate(payload: UserJwtPayload) {
    const user = await this.authLibService.validateUser(payload.email);
    if (!user) throw new UnauthorizedException(ErrorMessages.NOT_AUTHORIZED);

    return user;
  }
}
