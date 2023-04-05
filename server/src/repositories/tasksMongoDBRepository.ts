import { DefaultMongoDBRepository } from './defaultMongoDBRepository'
import { Tasks } from '@src/models/tasks'
import { BaseRepository } from '.'

export class TasksMongoDBRepository
  extends DefaultMongoDBRepository<Tasks>
  implements BaseRepository<Tasks>
{
  constructor(tasksModel = Tasks) {
    super(tasksModel)
  }
}