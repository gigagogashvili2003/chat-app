import { PrismaLibService } from '@app/prisma-lib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  public constructor(private readonly prisma: PrismaLibService) {}

  public findAll() {
    return this.prisma.user.findMany();
  }
}
