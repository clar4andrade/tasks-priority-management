import { DefaultMongoDBRepository } from './defaultMongoDBRepository'
import { User } from '@src/models/user'
import { BaseRepository } from '.'

export class UserMongoDBRepository
  extends DefaultMongoDBRepository<User>
  implements BaseRepository<User>
{
  constructor(userModel = User) {
    super(userModel)
  }
}
