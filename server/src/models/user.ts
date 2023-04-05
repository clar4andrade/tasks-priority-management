import mongoose, { Document } from 'mongoose'
import AuthService from '@src/services/auth'
import logger from '@src/logger'
import { BaseModel } from '.'

export interface User extends BaseModel {
  name: string
  surname: string
  email: string
  password: string                     
}

export interface ExistingUser extends User {
  id: string
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
      },
    },
  }
)

userSchema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email })
    return !emailCount
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
)

userSchema.pre<User & Document>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return
  }
  try {
    const hash = await AuthService.hashPassword(this.password)
    this.password = hash
  } catch (err) {
    logger.error(`Error hashing the password for the user ${this.name}`, err)
  }
})

export const User = mongoose.model<User>('User', userSchema)
