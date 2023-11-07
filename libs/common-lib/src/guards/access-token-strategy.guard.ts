import { Tokens } from '@app/utils-lib';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard(Tokens.ACCESS_TOKEN) {}
