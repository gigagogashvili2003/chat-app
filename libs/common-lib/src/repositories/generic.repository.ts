import { Prisma } from '@prisma/client';

export abstract class GenericRepository<T, P> {
  abstract findOneById(id: number): Promise<T>;
  abstract find(params: P): Promise<T[]>;
}
