import mongoose from 'mongoose'
import { BaseModel } from '.'

export interface Tasks extends BaseModel {
    user_id: string
    name: string
    description: string
    urgency: number
    importance: number
    priority: number 
    priority_stage: number
    status: string                       
}


const tasksSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true }, 
    name: { type: String, required: true },
    description: { type: String, required: true },
    urgency: { type: Number, required: true },
    importance: { type: Number, required: true },
    priority: { type: Number, required: true },
    priority_stage: { type: Number, required: true },
    status: { type: String, required: true }
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

export const Tasks = mongoose.model<Tasks>('Tasks', tasksSchema)