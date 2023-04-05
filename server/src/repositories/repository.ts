import { BaseRepository, FilterOptions, WithId, New } from '.'

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class DatabaseValidationError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

export abstract class Repository<T> implements BaseRepository<T> {
  public abstract isValidId(id: string): boolean

  public abstract create(data: T): Promise<WithId<T>>

  public abstract findOne(
    options: FilterOptions
  ): Promise<WithId<T> | undefined>

  public abstract findOneById(id: string): Promise<WithId<T> | undefined>

  public abstract find(filter: FilterOptions): Promise<WithId<T>[] | undefined>

  public abstract findByIdAndUpdate(
    id: string,
    update: FilterOptions,
    item: New
  ): Promise<WithId<T>>

  public abstract findByIdAndDelete(id: string): Promise<void>

  public abstract deleteAll(): Promise<void>
}