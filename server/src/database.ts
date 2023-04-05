import mongoose, { connection } from 'mongoose'
import 'dotenv/config'

export const connect = async (): Promise<void> => {
  await mongoose.connect(`${process.env.DB_URI}`)
}

export const close = (): Promise<void> => connection.close();