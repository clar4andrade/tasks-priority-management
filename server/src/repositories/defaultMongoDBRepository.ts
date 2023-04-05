import { BaseModel } from '@src/models'
import { FilterOptions, WithId, New } from '.'
import { Error, isValidObjectId, Model } from 'mongoose'
import { CUSTOM_VALIDATION } from '@src/models/user'
import {
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
  Repository,
} from './repository'
import logger from '@src/logger'

export abstract class DefaultMongoDBRepository<
  T extends BaseModel
> extends Repository<T> {
  constructor(private model: Model<T>) {
    super()
  }

  isValidId(id: string) {
    return isValidObjectId(id)
  }

  async create(data: T) {
    let createdData
    try {
      const model = new this.model(data)
      createdData = await model.save()
    } catch (err) {
      this.handleError(err)
    }
    return createdData as unknown as WithId<T>
  }

  async findOne(options: FilterOptions) {
    let data
    try {
      data = await this.model.findOne(options)
    } catch (err) {
      this.handleError(err)
    }

    return data as unknown as WithId<T>
  }

  async findOneById(id: string) {
    let data
    try {
      data = await this.model.findById(id)
    } catch (err) {
      this.handleError(err)
    }

    return data as unknown as WithId<T>
  }

  async findByIdAndUpdate(id: string, update: FilterOptions, item: New) {
    let data
    try {
      data = await this.model.findByIdAndUpdate(id, update, item)
    } catch (err) {
      this.handleError(err)
    }
    return data as unknown as WithId<T>
  }

  async find(options: FilterOptions) {
    let data
    try {
      data = await this.model.find(options)
    } catch (err) {
      this.handleError(err)
    }
    return data?.map((d) => d as unknown as WithId<T>)
  }

  async findByIdAndDelete(id: string) {
    await this.model.findByIdAndDelete(id)
  }

  async deleteAll() {
    await this.model.deleteMany({})
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        (err) =>
          err.name === 'ValidatorError' &&
          err.kind === CUSTOM_VALIDATION.DUPLICATED
      )
      if (duplicatedKindErrors.length) {
        throw new DatabaseValidationError(error.message)
      }
      throw new DatabaseUnknownClientError(error.message)
    }

    logger.error('Database error', error)
    
    throw new DatabaseInternalError(
      'Something unexpected happened to the database'
    )
  }
}
