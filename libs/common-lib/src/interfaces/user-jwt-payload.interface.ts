import { $Enums } from '@prisma/client';

export interface UserJwtPayload {
  sub: number;
  username: string;
  email: string;
  role: $Enums.Role;
}
