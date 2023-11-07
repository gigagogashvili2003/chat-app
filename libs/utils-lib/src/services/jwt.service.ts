import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from '../constants';
import { Tokens } from '../enums';

@Injectable()
export class JwtService {
  private ACCESS_TOKEN_EXPIRES_IN: string;
  private REFRESH_TOKEN_EXPIRES_IN: string;
  private ACCESS_TOKEN_SECRET: string;
  private REFRESH_TOKEN_SECRET: string;

  public constructor(
    private readonly jwtService: Jwt,
    private readonly configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_EXPIRES_IN = configService.get<string>(ACCESS_TOKEN_EXPIRES_IN);
    this.REFRESH_TOKEN_EXPIRES_IN = configService.get<string>(REFRESH_TOKEN_EXPIRES_IN);
    this.ACCESS_TOKEN_SECRET = configService.get<string>(ACCESS_TOKEN_SECRET);
    this.REFRESH_TOKEN_SECRET = configService.get<string>(REFRESH_TOKEN_SECRET);
  }

  public async sign<P extends Object | Buffer>(payload: P, type: Tokens = Tokens.ACCESS_TOKEN): Promise<string> {
    try {
      let token: string;
      switch (type) {
        case Tokens.ACCESS_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
            secret: this.ACCESS_TOKEN_SECRET,
          });
          break;
        case Tokens.REFRESH_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
            secret: this.REFRESH_TOKEN_SECRET,
          });
          break;
      }

      return token;
    } catch (err) {
      throw err;
    }
  }

  public getRefreshTokenExpirationTime(): Date {
    const currentDate = new Date();
    const expirationTime = currentDate.setDate(currentDate.getDate() + 7);
    return new Date(expirationTime);
  }

  public getAccessTokenExpirationTime(): Date {
    const currentDate = new Date();
    const expirationTime = currentDate.setDate(currentDate.getDate() + 1);
    return new Date(expirationTime);
  }

  public getAccessTokenMaxAge() {
    return 60 * 60 * 24;
  }

  public getRefreshTokenMaxAge() {
    return 60 * 60 * 24 * 7;
  }
}
