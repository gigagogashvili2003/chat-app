import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryType } from '../types';
import { UsersRepository } from '../constants';
@Injectable()
export class UsersLibService {
  public constructor(@Inject(UsersRepository) private readonly usersRepository: UsersRepositoryType) {}

  public find() {}
}
