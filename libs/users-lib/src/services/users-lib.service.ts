import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';

@Injectable()
export class UsersLibService {
  public constructor(private readonly usersRepository: UsersRepository) {}

  public async findAllUser() {
    return await this.usersRepository.findAll();
  }
}
