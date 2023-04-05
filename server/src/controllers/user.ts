import { Controller, Get, Post, Patch, Middleware } from '@overnightjs/core'
import { Request, Response } from 'express'
import AuthService from '@src/services/auth'
import { BaseRepository } from '@src/repositories/'
import { User } from '@src/models/user'
import { BaseController } from '.'
import { authMiddleware } from '@src/middlewares/auth'

@Controller('api/users')
export default class UserController extends BaseController {
  constructor(private userRepository: BaseRepository<User>) {
    super()
  }
//
  @Post('signup')
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userRepository.create(req.body)
      const token = AuthService.generateToken(user.id)
      res.status(201).send({user, token })
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err)
    }
  }

  @Post('login')
  public async loginUser(req: Request, res: Response): Promise<Response> {
    const user = await this.userRepository.findOne({ email: req.body.email })

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not Found',
      })
    }

    if (
      !(await AuthService.comparePasswords(req.body.password, user.password))
    ) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Wrong Credentials',
      })
    }

    const token = AuthService.generateToken(user.id)

    return res.send({ ...user, ...{ token } })
  }

  @Patch(':id')
  @Middleware(authMiddleware)
  public async updateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const update = req.body

    try {
      const user = await this.userRepository.findByIdAndUpdate(id, update, {
        new: true,
      })
      res.status(200).send(user)
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err)
    }
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: any, res: Response): Promise<Response> {
    const userId = req.context?.userId
    if (!userId) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'unauthorized, not authenticated',
      })
    }
    const user = await this.userRepository.findOneById(userId)
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      })
    }

    return res.send({ user })
  }

}
