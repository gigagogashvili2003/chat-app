export abstract class GenericRepository<T> {
  abstract findOneById(id: number): Promise<T>;
  abstract create(entity: T): Promise<T>;
  abstract update(id: number): Promise<T>;
  abstract deleteById(id: number): Promise<T>;
}
