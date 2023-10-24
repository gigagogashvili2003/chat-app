export abstract class GenericRepository<T, P, D> {
  abstract find(params: P): Promise<T[]>;
  abstract findOneById(id: number): Promise<T>;
  abstract create(data: D): Promise<T>;
  abstract update(id: number): Promise<T>;
  abstract delete(id: number): Promise<T>;
}
