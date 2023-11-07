import { UserWithoutPassword } from '@app/users-lib';
import { ITokens } from './jwt-tokens.interface';

export interface SignInResponse {
  userInfo: UserWithoutPassword;
  tokenInfo: ITokens;
}
