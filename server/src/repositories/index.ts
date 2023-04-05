export type FilterOptions = Record<string, unknown>

export type New = { new: boolean }

export type WithId<T> = { id: string } & T

export interface BaseRepository<T> {
  isValidId(id: string): boolean
  create(data: T): Promise<WithId<T>>
  findOne(options: FilterOptions): Promise<WithId<T> | undefined>
  findOneById(id: string): Promise<WithId<T> | undefined>
  find(options: FilterOptions): Promise<WithId<T>[] | undefined>
  findByIdAndUpdate(
    id: string,
    update: FilterOptions,
    item: New
  ): Promise<WithId<T>>
  findByIdAndDelete(id: string): Promise<void>
  deleteAll(): Promise<void>
}