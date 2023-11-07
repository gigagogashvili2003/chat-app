import { Tokens } from '@app/utils-lib';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(Tokens.REFRESH_TOKEN) {}
