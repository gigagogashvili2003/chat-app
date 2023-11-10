export interface ITokens {
  accessToken: string;
  accessTokenExpiresAt: string | Date;
  refreshToken: string;
  refreshTokenExpiresAt: string | Date;
}
